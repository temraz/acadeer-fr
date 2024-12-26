import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

const FileUpload = ({ 
  label, 
  accept, 
  value, 
  onChange, 
  required, 
  error,
  rtl,
  disabled,
  previewType = 'rectangle'
}) => {
  const { t } = useApp();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (disabled) return;
    
    const file = e.dataTransfer.files[0];
    if (file) {
      onChange(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const clearFile = () => {
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={rtl ? 'rtl' : 'ltr'}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div
        className={`
          relative group
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {value ? (
          <div className={`
            relative
            ${previewType === 'circle' 
              ? 'w-32 h-32 mx-auto rounded-full'
              : 'w-full rounded-lg'
            }
            bg-white dark:bg-gray-700
            border border-gray-300 dark:border-gray-600
            p-4
          `}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Upload className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {value.name}
                </span>
              </div>
              {!disabled && (
                <button
                  onClick={clearFile}
                  className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div
            onClick={() => !disabled && fileInputRef.current?.click()}
            className={`
              relative
              ${previewType === 'circle' 
                ? 'w-32 h-32 mx-auto rounded-full'
                : 'w-full rounded-lg'
              }
              bg-white dark:bg-gray-700
              border-2 border-dashed border-gray-300 dark:border-gray-600
              p-6
              transition-colors
              hover:border-blue-500 dark:hover:border-blue-400
              ${error ? 'border-red-500' : ''}
            `}
          >
            <div className="text-center">
              <Upload className="w-8 h-8 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                {t('dragAndDrop')}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {t('or')}
              </p>
              <button
                type="button"
                disabled={disabled}
                className="mt-2 px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                {t('browseFiles')}
              </button>
            </div>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default FileUpload; 