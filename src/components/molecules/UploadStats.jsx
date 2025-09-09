import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { formatFileSize } from "@/utils/fileUtils";

const UploadStats = ({ files, className }) => {
  const totalFiles = files.length;
  const completedFiles = files.filter(f => f.status === "completed").length;
  const failedFiles = files.filter(f => f.status === "error").length;
  const uploadingFiles = files.filter(f => f.status === "uploading").length;
  const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  const completedSize = files
    .filter(f => f.status === "completed")
    .reduce((acc, file) => acc + file.size, 0);
  
  const overallProgress = totalFiles > 0 ? (completedFiles / totalFiles) * 100 : 0;

  const stats = [
    {
      label: "Total Files",
      value: totalFiles,
      icon: "Files",
      color: "text-gray-600"
    },
    {
      label: "Completed",
      value: completedFiles,
      icon: "CheckCircle",
      color: "text-success-500"
    },
    {
      label: "Uploading",
      value: uploadingFiles,
      icon: "Upload",
      color: "text-primary-500"
    },
    {
      label: "Failed",
      value: failedFiles,
      icon: "XCircle",
      color: "text-error-500"
    }
  ];

  if (totalFiles === 0) return null;

  return (
    <div className={cn("bg-white rounded-xl shadow-md border border-gray-200 p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Upload Progress</h3>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">
            {Math.round(overallProgress)}%
          </div>
          <div className="text-xs text-gray-500">
            {formatFileSize(completedSize)} / {formatFileSize(totalSize)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center p-3 rounded-lg bg-gray-50">
            <div className="flex items-center justify-center mb-2">
              <ApperIcon
                name={stat.icon}
                size={20}
                className={stat.color}
              />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </div>
            <div className="text-xs text-gray-600">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Overall Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${overallProgress}%` }}
        />
      </div>
    </div>
  );
};

export default UploadStats;