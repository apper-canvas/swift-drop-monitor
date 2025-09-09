import React, { useState, useRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { createUploadFile, validateFile } from "@/utils/fileUtils";
import { toast } from "react-toastify";

const FileUploader = ({ onFilesAdd, className }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  // Maximum file size (100MB)
  const MAX_FILE_SIZE = 100 * 1024 * 1024;
  
  // Allowed file types (empty array means all types allowed)
  const ALLOWED_TYPES = [];

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only set drag over to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    await processFiles(files);
    
    // Clear the input so the same files can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const processFiles = async (files) => {
    if (files.length === 0) return;

    setIsProcessing(true);

    try {
      const validFiles = [];
      const invalidFiles = [];

      // Validate each file
      for (const file of files) {
        const validation = validateFile(file, MAX_FILE_SIZE, ALLOWED_TYPES);
        if (validation.valid) {
          validFiles.push(file);
        } else {
          invalidFiles.push({ file, errors: validation.errors });
        }
      }

      // Show errors for invalid files
      invalidFiles.forEach(({ file, errors }) => {
        toast.error(`${file.name}: ${errors.join(", ")}`);
      });

      // Process valid files
      if (validFiles.length > 0) {
        const uploadFiles = [];
        
        for (let i = 0; i < validFiles.length; i++) {
          const file = validFiles[i];
          const id = Date.now() + i; // Simple ID generation
          const uploadFile = await createUploadFile(file, id.toString());
          uploadFiles.push(uploadFile);
        }

        onFilesAdd(uploadFiles);
        
        if (validFiles.length === 1) {
          toast.success("File added successfully!");
        } else {
          toast.success(`${validFiles.length} files added successfully!`);
        }
      }
    } catch (error) {
      toast.error("Failed to process files");
      console.error("File processing error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer group",
          isDragOver
            ? "border-primary-500 bg-primary-50 scale-[1.02] shadow-lg"
            : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100",
          isProcessing && "pointer-events-none opacity-75"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="*/*"
        />

        {/* Upload Icon */}
        <div className={cn(
          "inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 transition-all duration-300",
          isDragOver
            ? "bg-primary-100 text-primary-600 scale-110"
            : "bg-gray-200 text-gray-500 group-hover:bg-gray-300 group-hover:text-gray-600"
        )}>
          {isProcessing ? (
            <ApperIcon
              name="Loader2"
              size={32}
              className="animate-spin"
            />
          ) : (
            <ApperIcon
              name={isDragOver ? "Upload" : "CloudUpload"}
              size={32}
            />
          )}
        </div>

        {/* Upload Text */}
        <div className="space-y-2">
          <h3 className={cn(
            "text-xl font-semibold transition-colors duration-300",
            isDragOver ? "text-primary-700" : "text-gray-700"
          )}>
            {isProcessing
              ? "Processing files..."
              : isDragOver
              ? "Drop files here"
              : "Upload your files"
            }
          </h3>
          
          {!isProcessing && (
            <>
              <p className="text-gray-600 mb-4">
                Drag and drop files here, or click to select files
              </p>
              
              <Button
                variant="primary"
                size="md"
                className="inline-flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
              >
                <ApperIcon name="Plus" size={16} />
                Choose Files
              </Button>
            </>
          )}
        </div>

        {/* Upload Constraints */}
        {!isProcessing && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <ApperIcon name="HardDrive" size={12} />
                <span>Max 100MB per file</span>
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Files" size={12} />
                <span>Multiple files supported</span>
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Shield" size={12} />
                <span>All file types accepted</span>
              </div>
            </div>
          </div>
        )}

        {/* Drag Overlay Effect */}
        {isDragOver && (
          <div className="absolute inset-0 bg-primary-500 bg-opacity-5 rounded-xl pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default FileUploader;