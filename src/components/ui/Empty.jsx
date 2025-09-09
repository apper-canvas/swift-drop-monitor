import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  className,
  title = "No items found",
  description = "There are no items to display at the moment.",
  icon = "Inbox",
  action,
  actionLabel
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[200px] text-center space-y-4 p-6",
      className
    )}>
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <ApperIcon 
          name={icon} 
          size={32} 
          className="text-gray-400"
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        <p className="text-gray-600 max-w-md">
          {description}
        </p>
      </div>

      {action && actionLabel && (
        <Button
          variant="primary"
          onClick={action}
          className="inline-flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;