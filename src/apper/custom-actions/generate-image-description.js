import OpenAI from "npm:openai@4.52.1";

// Global declarations for apper custom action environment
/* global apper, Response */
apper.serve(async (request) => {
  try {
    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Method not allowed'
        }),
        {
          status: 405,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { fileData, fileName, mimeType } = await request.json();
    
    // Validate required fields
    if (!fileData || !fileName || !mimeType) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required fields: fileData, fileName, mimeType'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if it's an image file
    if (!mimeType.startsWith('image/')) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'File is not an image'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get OpenAI API key from secrets
    const apiKey = await apper.getSecret('OPENAI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'OpenAI API key not configured'
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey
    });

    try {
      // Call OpenAI Vision API
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Describe this image in exactly one line. Be concise and focus on the main subject or content of the image."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${fileData}`
                }
              }
            ]
          }
        ],
        max_tokens: 100,
        temperature: 0.3
      });

      const description = response.choices[0]?.message?.content?.trim();
      
      if (!description) {
        throw new Error('No description generated');
      }

      return new Response(
        JSON.stringify({
          success: true,
          description: description
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );

    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to generate description: ${openaiError.message}`
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

  } catch (error) {
    console.error('Custom action error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});