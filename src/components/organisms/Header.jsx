import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ className }) => {
  return (
    <header className={cn(
      "bg-white border-b border-gray-200 shadow-sm",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md">
              <ApperIcon 
                name="CloudUpload" 
                size={24} 
                className="text-white"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Swift Drop
              </h1>
              <p className="text-xs text-gray-500 -mt-1">
                File Uploader
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              Upload
            </a>
            <a
              href="#"
              className="text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors duration-200"
            >
              History
            </a>
            <a
              href="#"
              className="text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors duration-200"
            >
              Settings
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;