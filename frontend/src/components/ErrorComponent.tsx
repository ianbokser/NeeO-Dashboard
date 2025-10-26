import React from 'react';
import { ApiError } from '../types';

interface ErrorComponentProps {
  error: ApiError;
  onRetry?: () => void;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ error, onRetry }) => {
  // Determine error type and provide specific messages
  const getErrorInfo = () => {
    const isTimeoutError = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
    const isNetworkError = error.code === 'NETWORK_ERROR' || !error.status;
    const isServerError = error.status && error.status >= 500;
    
    if (isTimeoutError) {
      return {
        title: 'Request Timeout',
        message: 'The blockchain network is taking longer than expected to respond. This is common during high network activity.',
        suggestion: 'Try again in a few moments. If the problem persists, the blockchain network may be experiencing high traffic.',
        icon: '⏱️'
      };
    }
    
    if (isNetworkError) {
      return {
        title: 'Network Connection Error',
        message: 'Unable to connect to the blockchain API service.',
        suggestion: 'Please check your internet connection and ensure the API server is running.',
        icon: '🌐'
      };
    }
    
    if (isServerError) {
      return {
        title: 'Server Error',
        message: 'The blockchain API service is experiencing issues.',
        suggestion: 'The service may be temporarily unavailable. Please try again later.',
        icon: '🔧'
      };
    }
    
    return {
      title: 'Something went wrong',
      message: error.message || 'An unexpected error occurred',
      suggestion: 'If this problem persists, please check your network connection or contact support.',
      icon: '⚠️'
    };
  };

  const errorInfo = getErrorInfo();

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
          <span className="text-2xl">{errorInfo.icon}</span>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2">
          {errorInfo.title}
        </h3>
        
        <p className="text-gray-400 mb-2">
          {errorInfo.message}
        </p>
        
        {error.code && (
          <p className="text-sm text-gray-500 mb-4">
            Error Code: {error.code}
          </p>
        )}
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary mb-4"
          >
            Try Again
          </button>
        )}
        
        <div className="p-3 bg-dark-100 rounded-lg border border-red-500/20">
          <p className="text-xs text-gray-500">
            {errorInfo.suggestion}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorComponent;