import React from 'react';

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center p-3 rounded-lg w-20 transition-all duration-300 ${
      active 
        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' 
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
    }`}
  >
    {React.cloneElement(icon, { 
      size: 28, 
      strokeWidth: active ? 2.5 : 1.5 
    })}
    <span className="text-xs mt-2">{label}</span>
  </button>
);

export default NavItem; 