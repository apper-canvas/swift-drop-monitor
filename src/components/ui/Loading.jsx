import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ className, message = "Loading..." }) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[200px] space-y-4",
      className
    )}>
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary-500 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-600 text-sm font-medium">{message}</p>
    </div>
  );
};

// Skeleton loader for file items
export const FileItemSkeleton = ({ className }) => {
  return (
    <div className={cn(
      "flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 animate-pulse",
      className
    )}>
      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-2 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
    </div>
  );
};

// Skeleton loader for upload stats
export const UploadStatsSkeleton = ({ className }) => {
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-md border border-gray-200 p-6 animate-pulse",
      className
    )}>
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 bg-gray-200 rounded w-32"></div>
        <div className="text-right space-y-1">
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="text-center p-3 rounded-lg bg-gray-50">
            <div className="w-5 h-5 bg-gray-200 rounded mx-auto mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
          </div>
        ))}
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3"></div>
    </div>
  );
};

export default Loading;