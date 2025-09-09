import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  children, 
  className,
  variant = "default",
  size = "md",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border border-gray-300",
    primary: "bg-primary-100 text-primary-800 border border-primary-200",
    success: "bg-success-100 text-success-800 border border-success-200",
    warning: "bg-warning-100 text-warning-800 border border-warning-200",
    error: "bg-error-100 text-error-800 border border-error-200",
    gradient: "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm"
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs font-medium",
    md: "px-2.5 py-0.5 text-xs font-medium",
    lg: "px-3 py-1 text-sm font-medium"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;