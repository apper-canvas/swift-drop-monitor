import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import ProgressBar from "@/components/atoms/ProgressBar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { formatFileSize, getFileType } from "@/utils/fileUtils";

const FileItem = ({ file, onRemove, className }) => {
  const getFileIcon = (fileType) => {
    const iconMap = {
      image: "Image",
      video: "Video",
      audio: "Music",
      pdf: "FileText",
      text: "FileText",
      archive: "Archive",
      file: "File"
    };
    return iconMap[fileType] || "File";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "error":
        return "error";
      case "uploading":
        return "primary";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "CheckCircle";
      case "error":
        return "XCircle";
      case "uploading":
        return "Loader2";
      default:
        return null;
    }
  };

  const fileType = getFileType(file);
  const statusIcon = getStatusIcon(file.status);

  return (
    <div className={cn(
      "flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200",
      file.status === "uploading" && "ring-2 ring-primary-100",
      file.status === "completed" && "ring-2 ring-success-100",
      file.status === "error" && "ring-2 ring-error-100",
      className
    )}>
      {/* File Thumbnail/Icon */}
      <div className="flex-shrink-0">
        {file.thumbnail ? (
          <img
            src={file.thumbnail}
            alt={file.name}
            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
            <ApperIcon
              name={getFileIcon(fileType)}
              size={24}
              className="text-gray-600"
            />
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-medium text-gray-900 truncate pr-2">
            {file.name}
          </h3>
          <div className="flex items-center gap-2">
            <Badge
              variant={getStatusColor(file.status)}
              size="sm"
              className="capitalize"
            >
              {file.status}
            </Badge>
            {file.status === "pending" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(file.id)}
                className="p-1 h-auto text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={16} />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>{formatFileSize(file.size)}</span>
          {file.status === "uploading" && (
            <span>{Math.round(file.progress)}%</span>
          )}
        </div>

        {/* Progress Bar */}
        {file.status === "uploading" && (
          <ProgressBar
            value={file.progress}
            variant="primary"
            size="sm"
            showValue={false}
            className="mb-1"
          />
        )}

        {/* Error Message */}
        {file.status === "error" && file.error && (
          <p className="text-xs text-error-600 mt-1">
            {file.error}
          </p>
        )}
      </div>

      {/* Status Icon */}
      {statusIcon && (
        <div className="flex-shrink-0">
          <ApperIcon
            name={statusIcon}
            size={20}
            className={cn(
              file.status === "completed" && "text-success-500",
              file.status === "error" && "text-error-500",
              file.status === "uploading" && "text-primary-500 animate-spin"
            )}
          />
        </div>
      )}
    </div>
  );
};

export default FileItem;