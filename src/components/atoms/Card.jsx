import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  children, 
  className,
  variant = "default",
  ...props 
}, ref) => {
  const variants = {
    default: "bg-white shadow-md border border-gray-200",
    elevated: "bg-white shadow-lg border border-gray-200",
    flat: "bg-gray-50 border border-gray-200",
    gradient: "bg-gradient-to-br from-white to-gray-50 shadow-md border border-gray-200"
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg overflow-hidden transition-shadow duration-200",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;