import React from 'react';
import { ApiError } from '../types';

interface ErrorComponentProps {
  error: ApiError;
  onRetry?: () => void;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ error, onRetry }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-400 mb-1">
          {error.message || 'An unexpected error occurred'}
        </p>
        
        {error.code && (
          <p className="text-sm text-gray-500 mb-4">
            Error Code: {error.code}
          </p>
        )}
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary"
          >
            Try Again
          </button>
        )}
        
        <div className="mt-4 p-3 bg-dark-100 rounded-lg border border-red-500/20">
          <p className="text-xs text-gray-500">
            If this problem persists, please check your network connection
            or contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorComponent;