import React from 'react';

interface NavbarProps {
  onWalletConnect?: () => void;
  walletAddress?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onWalletConnect, walletAddress }) => {
  return (
    <nav className="glass-effect sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">N</span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold gradient-text">NeeO Dashboard</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
          
          {walletAddress ? (
            <div className="px-2 sm:px-3 py-1 sm:py-2 bg-dark-100 rounded-lg border border-primary-600/30">
              <span className="text-primary-400 text-xs sm:text-sm font-mono">
                {`${walletAddress.slice(0, 4)}...${walletAddress.slice(-3)}`}
              </span>
            </div>
          ) : (
            <button
              onClick={onWalletConnect}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-lg transition-colors duration-200"
            >
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Connect</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;