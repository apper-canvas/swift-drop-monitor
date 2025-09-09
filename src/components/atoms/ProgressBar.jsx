import React from "react";
import { cn } from "@/utils/cn";

const ProgressBar = React.forwardRef(({ 
  value = 0, 
  max = 100,
  className,
  showValue = true,
  variant = "primary",
  size = "md",
  ...props 
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-primary-600",
    success: "bg-gradient-to-r from-success-500 to-success-600",
    warning: "bg-gradient-to-r from-warning-500 to-warning-600",
    error: "bg-gradient-to-r from-error-500 to-error-600"
  };

  const sizes = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3"
  };

  return (
    <div
      ref={ref}
      className={cn("w-full bg-gray-200 rounded-full overflow-hidden", className)}
      {...props}
    >
      <div
        className={cn(
          "transition-all duration-300 ease-out rounded-full",
          variants[variant],
          sizes[size]
        )}
        style={{ width: `${percentage}%` }}
      >
        {showValue && size !== "sm" && (
          <span className="sr-only">{Math.round(percentage)}% complete</span>
        )}
      </div>
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;