import * as React from 'react';
import { useEffect, useState } from 'react';

interface LoadingWithRetryProps {
  isLoading: boolean;
  message?: string;
}

const LoadingWithRetry: React.FC<LoadingWithRetryProps> = ({ 
  isLoading, 
  message = "Loading transactions..." 
}) => {
  const [dots, setDots] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setDots('');
      setTimeElapsed(0);
      return;
    }

    // Animation for dots
    const dotsInterval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    // Timer for elapsed time
    const timerInterval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(dotsInterval);
      clearInterval(timerInterval);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  const getLoadingMessage = () => {
    if (timeElapsed < 5) {
      return `${message}${dots}`;
    } else if (timeElapsed < 15) {
      return `Still loading${dots} Blockchain networks can be slow during high traffic.`;
    } else if (timeElapsed < 30) {
      return `Please wait${dots} This is taking longer than usual. The network may be congested.`;
    } else {
      return `Almost there${dots} Thank you for your patience. Complex blockchain queries can take time.`;
    }
  };

  return (
    <div className="card p-6 sm:p-8 text-center">
      <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-primary-500/20 rounded-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary-400"></div>
      </div>
      
      <h3 className="text-base sm:text-lg font-medium text-gray-300 mb-2">
        {getLoadingMessage()}
      </h3>
      
      {timeElapsed > 10 && (
        <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <p className="text-xs text-blue-400">
            💡 Tip: Blockchain API calls can take 10-30 seconds during peak hours. 
            We're using retry logic to ensure you get your data.
          </p>
        </div>
      )}
      
      {timeElapsed > 0 && (
        <div className="mt-2">
          <div className="text-xs text-gray-500">
            Loading for {timeElapsed} seconds...
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
            <div 
              className="bg-primary-500 h-1 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${Math.min((timeElapsed / 30) * 100, 100)}%` 
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingWithRetry;