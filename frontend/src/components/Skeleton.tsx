import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave';
  width?: string | number;
  height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'rectangular',
  animation = 'pulse',
  width,
  height 
}) => {
  const baseClasses = 'bg-gradient-to-r from-dark-100 via-dark-50 to-dark-100 bg-[length:200%_100%]';
  
  const variantClasses = {
    text: 'h-4 rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse bg-wave'
  };

  const styles: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1rem' : '100%')
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={styles}
    />
  );
};

// Skeleton components específicos
export const SkeletonCard: React.FC = () => (
  <div className="card p-6 space-y-4">
    <div className="flex items-center space-x-3">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
  </div>
);

export const SkeletonTable: React.FC = () => (
  <div className="card overflow-hidden">
    <div className="p-6 border-b border-dark-100">
      <Skeleton variant="text" width="200px" height="24px" className="mb-2" />
      <Skeleton variant="text" width="150px" height="16px" />
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-dark-100">
          <tr>
            {[...Array(6)].map((_, index) => (
              <th key={index} className="px-6 py-3">
                <Skeleton variant="text" width="80px" height="12px" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-100">
          {[...Array(5)].map((_, rowIndex) => (
            <tr key={rowIndex}>
              {[...Array(6)].map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <Skeleton 
                    variant="text" 
                    width={colIndex === 0 ? "120px" : colIndex === 3 ? "80px" : "100px"}
                    height="16px" 
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const SkeletonStats: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    {[...Array(4)].map((_, index) => (
      <div key={index} className="card p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="text-right space-y-2">
            <Skeleton variant="text" width="60px" height="24px" />
            <Skeleton variant="text" width="80px" height="14px" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;