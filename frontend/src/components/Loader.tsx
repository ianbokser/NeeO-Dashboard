import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-dark-100 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
        </div>
        
        {/* Inner ring */}
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-dark-100 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-accent-cyan rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
        </div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gradient-to-r from-primary-500 to-accent-cyan rounded-full animate-pulse"></div>
      </div>
      
      <div className="ml-4">
        <p className="text-gray-300 font-medium">Loading transactions...</p>
        <p className="text-gray-500 text-sm">Please wait while we fetch your data</p>
      </div>
    </div>
  );
};

export default Loader;