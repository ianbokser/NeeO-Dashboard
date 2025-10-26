import { useState, useRef, useEffect } from "react";
import { useWallet } from "../hooks/useWallet";

// Componente de configuraciones de wallet
const WalletSettings = ({ 
  isOpen, 
  onClose, 
  onSwitchChain, 
  onSwitchAccount, 
  onDisconnect,
  currentChain,
  availableChains,
  accounts,
  currentAccount
}: {
  isOpen: boolean;
  onClose: () => void;
  onSwitchChain: (chainId: string) => void;
  onSwitchAccount: (address: string) => void;
  onDisconnect: () => void;
  currentChain: any;
  availableChains: any[];
  accounts: any[];
  currentAccount: string | null;
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-dark-100 border border-gray-700 rounded-lg shadow-xl z-50">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Wallet Settings</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>

        {/* Current Account */}
        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2">Current Account</label>
          <div className="text-white font-mono text-sm bg-dark-200 p-2 rounded">
            {currentAccount ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}` : 'None'}
          </div>
        </div>

        {/* Network Selection */}
        <div className="mb-4">
          <label className="block text-gray-400 text-sm mb-2">Network</label>
          <select 
            value={currentChain?.chainId || ''}
            onChange={(e) => onSwitchChain(e.target.value)}
            className="w-full bg-dark-200 text-white p-2 rounded border border-gray-600 focus:border-primary-500 focus:outline-none"
          >
            {availableChains.map((chain) => (
              <option key={chain.chainId} value={chain.chainId}>
                {chain.chainName}
              </option>
            ))}
          </select>
        </div>

        {/* Account Selection */}
        {accounts.length > 1 && (
          <div className="mb-4">
            <label className="block text-gray-400 text-sm mb-2">Switch Account</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {accounts.map((account) => (
                <button
                  key={account.address}
                  onClick={() => onSwitchAccount(account.address)}
                  className={`w-full text-left p-2 rounded text-sm font-mono ${
                    account.isActive 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-dark-200 text-gray-300 hover:bg-dark-300'
                  }`}
                >
                  {`${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
                  {account.isActive && <span className="ml-2 text-xs">(Active)</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Disconnect Button */}
        <button
          onClick={onDisconnect}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors"
        >
          Disconnect Wallet
        </button>
      </div>
    </div>
  );
};

const WalletButton = () => {
  const {
    isConnected,
    isConnecting,
    currentAccount,
    currentChain,
    availableChains,
    accounts,
    error,
    connectWallet,
    disconnectWallet,
    switchChain,
    switchAccount,
    getShortAddress,
    getNetworkName,
  } = useWallet();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Cerrar settings al hacer click fuera
  const handleClickOutside = (event: Event) => {
    if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
      setSettingsOpen(false);
    }
  };

  // Agregar event listener para cerrar al hacer click fuera
  useEffect(() => {
    if (settingsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [settingsOpen]);

  const handleSwitchChain = async (chainId: string) => {
    try {
      await switchChain(chainId);
    } catch (error) {
      console.error('Error switching chain:', error);
    }
  };

  const handleSwitchAccount = async (address: string) => {
    try {
      await switchAccount(address);
      setSettingsOpen(false);
    } catch (error) {
      console.error('Error switching account:', error);
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setSettingsOpen(false);
  };

  if (error) {
    return (
      <div className="px-2 sm:px-3 py-1 sm:py-2 bg-red-900/50 border border-red-500/50 rounded-lg">
        <span className="text-red-400 text-xs sm:text-sm">
          Connection Error
        </span>
      </div>
    );
  }

  if (isConnected && currentAccount) {
    return (
      <div className="relative" ref={settingsRef}>
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="flex items-center space-x-2 px-2 sm:px-3 py-1 sm:py-2 bg-dark-100 hover:bg-dark-200 rounded-lg border border-primary-600/30 transition-colors"
        >
          <div className="flex flex-col items-start">
            <span className="text-primary-400 text-xs sm:text-sm font-mono">
              {getShortAddress()}
            </span>
            <span className="text-gray-400 text-xs">
              {getNetworkName()}
            </span>
          </div>
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform ${settingsOpen ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <WalletSettings
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onSwitchChain={handleSwitchChain}
          onSwitchAccount={handleSwitchAccount}
          onDisconnect={handleDisconnect}
          currentChain={currentChain}
          availableChains={availableChains}
          accounts={accounts}
          currentAccount={currentAccount}
        />
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className="px-3 sm:px-4 py-1.5 sm:py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors duration-200"
    >
      <span className="hidden sm:inline">
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </span>
      <span className="sm:hidden">
        {isConnecting ? "..." : "Connect"}
      </span>
    </button>
  );
};

const Navbar = () => {
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
          
          <WalletButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;