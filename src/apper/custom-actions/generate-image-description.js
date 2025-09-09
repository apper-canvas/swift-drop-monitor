import OpenAI from "npm:openai@4.52.1";
import React from "react";
import Error from "@/components/ui/Error";

/**
 * Custom Action: Generate Image Description
 * Uses OpenAI Vision API to analyze and describe uploaded images
 */
export default async function generateImageDescription(request) {
  try {
    // Parse request body
    const body = await request.json().catch(() => ({}));
    
    // Validate required fields
    if (!body.imageData) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing required field: imageData",
        message: "Please provide image data in base64 format"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!body.apiKey) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing required field: apiKey",
        message: "OpenAI API key is required for image analysis"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: body.apiKey,
    });

    // Prepare image data for OpenAI Vision API
    const imageUrl = body.imageData.startsWith('data:') 
      ? body.imageData 
      : `data:image/jpeg;base64,${body.imageData}`;

    // Generate description using OpenAI Vision
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: body.prompt || "Please provide a detailed description of this image, including objects, colors, composition, and any text visible in the image."
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: body.detail || "auto"
              }
            }
          ]
        }
      ],
      max_tokens: body.maxTokens || 500,
      temperature: body.temperature || 0.7,
    });

    // Extract description from response
    const description = response.choices?.[0]?.message?.content;

    if (!description) {
      throw new Error("No description generated from OpenAI API");
    }

    // Return successful response
    return new Response(JSON.stringify({
      success: true,
      data: {
        description,
        model: response.model,
        usage: response.usage,
        timestamp: new Date().toISOString()
      },
      message: "Image description generated successfully"
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error generating image description:", error);
    
    // Handle specific OpenAI API errors
    let errorMessage = "Failed to generate image description";
    let statusCode = 500;

    if (error.message?.includes("API key")) {
      errorMessage = "Invalid or missing OpenAI API key";
      statusCode = 401;
    } else if (error.message?.includes("quota")) {
      errorMessage = "OpenAI API quota exceeded";
      statusCode = 429;
    } else if (error.message?.includes("rate limit")) {
      errorMessage = "OpenAI API rate limit exceeded";
      statusCode = 429;
    } else if (error.message?.includes("model")) {
      errorMessage = "Unsupported model or model unavailable";
      statusCode = 400;
    }

    return new Response(JSON.stringify({
      success: false,
      error: error.message || "Unknown error",
      message: errorMessage,
      timestamp: new Date().toISOString()
    }), {
      status: statusCode,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// Export for compatibility with different custom action frameworks
export { generateImageDescription };