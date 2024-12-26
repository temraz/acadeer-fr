import React from 'react';

const FormField = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required, 
  error, 
  disabled,
  rtl,
  min,
  max,
  step,
  className = ''
}) => {
  return (
    <div className={rtl ? 'rtl' : 'ltr'}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={`
          w-full p-2
          bg-white dark:bg-gray-700
          border border-gray-300 dark:border-gray-600
          rounded-lg
          text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          transition-colors
          focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500
          disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        dir={rtl ? 'rtl' : 'ltr'}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default FormField; 