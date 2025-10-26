import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { ChainInfo } from '../contexts/WalletContext';

const WalletSettingsPage = () => {
  const {
    isConnected,
    currentAccount,
    currentChain,
    availableChains,
    accounts,
    error,
    switchChain,
    addCustomChain,
    refreshWalletData,
    getNetworkName,
    getShortAddress,
  } = useWallet();

  const [showAddChain, setShowAddChain] = useState(false);
  const [customChainForm, setCustomChainForm] = useState({
    chainId: '',
    chainName: '',
    nativeCurrency: {
      name: '',
      symbol: '',
      decimals: 18,
    },
    rpcUrls: [''],
    blockExplorerUrls: [''],
  });

  // Handle adding custom chain
  const handleAddCustomChain = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const chainInfo: ChainInfo = {
        ...customChainForm,
        rpcUrls: customChainForm.rpcUrls.filter(url => url.trim() !== ''),
        blockExplorerUrls: customChainForm.blockExplorerUrls.filter(url => url.trim() !== ''),
      };

      await addCustomChain(chainInfo);
      
      // Reset form
      setCustomChainForm({
        chainId: '',
        chainName: '',
        nativeCurrency: { name: '', symbol: '', decimals: 18 },
        rpcUrls: [''],
        blockExplorerUrls: [''],
      });
      setShowAddChain(false);
    } catch (error) {
      console.error('Error adding custom chain:', error);
    }
  };

  // Handle chain switch
  const handleSwitchChain = async (chainId: string) => {
    try {
      await switchChain(chainId);
    } catch (error) {
      console.error('Error switching chain:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Wallet Not Connected</h1>
          <p className="text-gray-400">Please connect your wallet to access settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Wallet Settings</h1>
          <p className="text-gray-400">Manage your wallet configuration and network settings</p>
        </div>

        {/* Current Wallet Info */}
        <div className="card p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Current Wallet</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Address</label>
              <div className="bg-dark-200 p-3 rounded-lg font-mono text-primary-400 text-sm break-all">
                {currentAccount}
              </div>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Current Network</label>
              <div className="bg-dark-200 p-3 rounded-lg text-white">
                {getNetworkName()} ({currentChain?.chainId})
              </div>
            </div>
          </div>
        </div>

        {/* Network Management */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Network Management</h2>
            <button
              onClick={() => setShowAddChain(!showAddChain)}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              Add Custom Network
            </button>
          </div>

          {/* Available Networks */}
          <div className="space-y-3 mb-6">
            <h3 className="text-gray-400 text-sm font-medium">Available Networks</h3>
            {availableChains.map((chain) => (
              <div
                key={chain.chainId}
                className={`p-4 rounded-lg border transition-colors ${
                  currentChain?.chainId === chain.chainId
                    ? 'border-primary-500 bg-primary-900/20'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{chain.chainName}</h4>
                    <p className="text-gray-400 text-sm">
                      {chain.nativeCurrency.symbol} • Chain ID: {chain.chainId}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {currentChain?.chainId === chain.chainId && (
                      <span className="px-2 py-1 bg-emerald-600 text-white text-xs rounded-full">
                        Active
                      </span>
                    )}
                    {currentChain?.chainId !== chain.chainId && (
                      <button
                        onClick={() => handleSwitchChain(chain.chainId)}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
                      >
                        Switch
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Custom Network Form */}
          {showAddChain && (
            <div className="border-t border-gray-600 pt-6">
              <h3 className="text-white font-medium mb-4">Add Custom Network</h3>
              <form onSubmit={handleAddCustomChain} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Chain ID (hex)</label>
                    <input
                      type="text"
                      value={customChainForm.chainId}
                      onChange={(e) =>
                        setCustomChainForm((prev) => ({ ...prev, chainId: e.target.value }))
                      }
                      placeholder="e.g., 0x89"
                      className="w-full bg-dark-200 border border-gray-600 text-white px-3 py-2 rounded-lg focus:border-primary-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Network Name</label>
                    <input
                      type="text"
                      value={customChainForm.chainName}
                      onChange={(e) =>
                        setCustomChainForm((prev) => ({ ...prev, chainName: e.target.value }))
                      }
                      placeholder="e.g., Polygon Mainnet"
                      className="w-full bg-dark-200 border border-gray-600 text-white px-3 py-2 rounded-lg focus:border-primary-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Currency Name</label>
                    <input
                      type="text"
                      value={customChainForm.nativeCurrency.name}
                      onChange={(e) =>
                        setCustomChainForm((prev) => ({
                          ...prev,
                          nativeCurrency: { ...prev.nativeCurrency, name: e.target.value },
                        }))
                      }
                      placeholder="e.g., MATIC"
                      className="w-full bg-dark-200 border border-gray-600 text-white px-3 py-2 rounded-lg focus:border-primary-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Currency Symbol</label>
                    <input
                      type="text"
                      value={customChainForm.nativeCurrency.symbol}
                      onChange={(e) =>
                        setCustomChainForm((prev) => ({
                          ...prev,
                          nativeCurrency: { ...prev.nativeCurrency, symbol: e.target.value },
                        }))
                      }
                      placeholder="e.g., MATIC"
                      className="w-full bg-dark-200 border border-gray-600 text-white px-3 py-2 rounded-lg focus:border-primary-500 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Decimals</label>
                    <input
                      type="number"
                      value={customChainForm.nativeCurrency.decimals}
                      onChange={(e) =>
                        setCustomChainForm((prev) => ({
                          ...prev,
                          nativeCurrency: { ...prev.nativeCurrency, decimals: parseInt(e.target.value) },
                        }))
                      }
                      className="w-full bg-dark-200 border border-gray-600 text-white px-3 py-2 rounded-lg focus:border-primary-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">RPC URL</label>
                  <input
                    type="url"
                    value={customChainForm.rpcUrls[0]}
                    onChange={(e) =>
                      setCustomChainForm((prev) => ({
                        ...prev,
                        rpcUrls: [e.target.value],
                      }))
                    }
                    placeholder="https://..."
                    className="w-full bg-dark-200 border border-gray-600 text-white px-3 py-2 rounded-lg focus:border-primary-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Block Explorer URL (optional)</label>
                  <input
                    type="url"
                    value={customChainForm.blockExplorerUrls[0]}
                    onChange={(e) =>
                      setCustomChainForm((prev) => ({
                        ...prev,
                        blockExplorerUrls: [e.target.value],
                      }))
                    }
                    placeholder="https://..."
                    className="w-full bg-dark-200 border border-gray-600 text-white px-3 py-2 rounded-lg focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  >
                    Add Network
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddChain(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Account Management */}
        {accounts.length > 1 && (
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Account Management</h2>
            <div className="space-y-3">
              {accounts.map((account) => (
                <div
                  key={account.address}
                  className={`p-4 rounded-lg border ${
                    account.isActive
                      ? 'border-primary-500 bg-primary-900/20'
                      : 'border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-primary-400 text-sm">
                        {getShortAddress(account.address)}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {account.address}
                      </div>
                    </div>
                    {account.isActive && (
                      <span className="px-2 py-1 bg-emerald-600 text-white text-xs rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Utilities */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Utilities</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={refreshWalletData}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Refresh Data
            </button>
            <button
              onClick={() => window.open(`https://etherscan.io/address/${currentAccount}`, '_blank')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              View on Explorer
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="card p-6 border-l-4 border-red-500 bg-red-900/20">
            <h3 className="text-red-400 font-semibold mb-2">Error</h3>
            <p className="text-gray-300 text-sm">
              {typeof error === 'string' ? error : error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletSettingsPage;