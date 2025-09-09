import React from "react";
import { cn } from "@/utils/cn";
import FileItem from "@/components/molecules/FileItem";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";

const FileQueue = ({ 
  files = [], 
  onRemoveFile, 
  onStartUpload, 
  onClearCompleted,
  className 
}) => {
  const pendingFiles = files.filter(f => f.status === "pending");
  const uploadingFiles = files.filter(f => f.status === "uploading");
  const completedFiles = files.filter(f => f.status === "completed");
  const errorFiles = files.filter(f => f.status === "error");

  const hasFilesToUpload = pendingFiles.length > 0;
  const isUploading = uploadingFiles.length > 0;
  const hasCompleted = completedFiles.length > 0;

  if (files.length === 0) {
    return (
      <div className={cn("", className)}>
        <Empty
          title="No files selected"
          description="Upload files to see them appear here"
          icon="Upload"
        />
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Queue Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          File Queue ({files.length})
        </h2>
        
        <div className="flex items-center gap-2">
          {hasFilesToUpload && (
            <Button
              variant="primary"
              size="md"
              onClick={onStartUpload}
              disabled={isUploading}
              className="inline-flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <ApperIcon name="Upload" size={16} />
                  Upload {pendingFiles.length} file{pendingFiles.length !== 1 ? "s" : ""}
                </>
              )}
            </Button>
          )}
          
          {hasCompleted && (
            <Button
              variant="ghost"
              size="md"
              onClick={onClearCompleted}
              className="inline-flex items-center gap-2"
            >
              <ApperIcon name="Trash2" size={16} />
              Clear Completed
            </Button>
          )}
        </div>
      </div>

      {/* File List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
        {/* Pending Files */}
        {pendingFiles.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            onRemove={onRemoveFile}
          />
        ))}

        {/* Uploading Files */}
        {uploadingFiles.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            onRemove={onRemoveFile}
          />
        ))}

        {/* Completed Files */}
        {completedFiles.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            onRemove={onRemoveFile}
          />
        ))}

        {/* Error Files */}
        {errorFiles.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            onRemove={onRemoveFile}
          />
        ))}
      </div>

      {/* Queue Summary */}
      {files.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-gray-200 text-sm text-gray-600">
          <div className="flex items-center gap-4">
            {pendingFiles.length > 0 && (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                {pendingFiles.length} pending
              </span>
            )}
            {uploadingFiles.length > 0 && (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                {uploadingFiles.length} uploading
              </span>
            )}
            {completedFiles.length > 0 && (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                {completedFiles.length} completed
              </span>
            )}
            {errorFiles.length > 0 && (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-error-500 rounded-full"></div>
                {errorFiles.length} failed
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileQueue;