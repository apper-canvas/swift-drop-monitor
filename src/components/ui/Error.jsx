import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  className,
  title = "Something went wrong",
  message = "We encountered an error while processing your request.",
  onRetry,
  showRetry = true
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[200px] text-center space-y-4 p-6",
      className
    )}>
      <div className="w-16 h-16 bg-error-100 rounded-full flex items-center justify-center">
        <ApperIcon 
          name="AlertTriangle" 
          size={32} 
          className="text-error-500"
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        <p className="text-gray-600 max-w-md">
          {message}
        </p>
      </div>

      {showRetry && onRetry && (
        <Button
          variant="primary"
          onClick={onRetry}
          className="inline-flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;