import React from 'react';
import { X, FileText, Image } from 'lucide-react';

const FilePreview = ({ file, onRemove }) => {
  const isImage = file.type.startsWith('image/');
  
  return (
    <div className="relative group">
      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        {isImage ? (
          <div className="relative h-32 w-full">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="h-full w-full object-cover rounded"
            />
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-gray-400" />
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        )}
        
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default FilePreview; 