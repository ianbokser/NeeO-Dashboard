import React, { useState, useEffect, useCallback } from 'react';
import { TransactionTable, ErrorComponent } from '../components';
import { SkeletonStats, SkeletonTable } from '../components/Skeleton';
import { DashboardState, Transaction, ApiError, WalletInfo } from '../types';
import { transactionService } from '../services/api';

const DashboardPage: React.FC = () => {
  const [state, setState] = useState<DashboardState>({
    transactions: [],
    loading: 'idle',
    error: null,
    wallet: null,
    total: 0,
    hasMore: false,
  });

  const [walletInput, setWalletInput] = useState<string>('');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('ethereum');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // Mock wallet for demo purposes
  const demoWallet = '0x742d35Cc6634C0532925a3b8D375af0f4123C976';

  // Load transactions
  const loadTransactions = useCallback(async (walletAddress: string, network: string = 'ethereum') => {
    setState(prev => ({ ...prev, loading: 'loading', error: null }));

    try {
      const response = await transactionService.getTransactions(walletAddress, network);
      
      setState(prev => ({
        ...prev,
        transactions: response.transactions,
        total: response.total,
        hasMore: response.hasMore || false,
        loading: 'success',
        wallet: {
          address: walletAddress,
          network,
        },
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: 'error',
        error: error as ApiError,
      }));
    }
  }, []);

  // Handle wallet connection (demo)
  const handleConnectWallet = useCallback(() => {
    const wallet = walletInput || demoWallet;
    setWalletInput(wallet);
    loadTransactions(wallet, selectedNetwork);
  }, [walletInput, selectedNetwork, loadTransactions]);

  // Handle retry
  const handleRetry = useCallback(() => {
    if (state.wallet) {
      loadTransactions(state.wallet.address, state.wallet.network);
    }
  }, [state.wallet, loadTransactions]);

  // Load demo data on component mount
  useEffect(() => {
    loadTransactions(demoWallet, selectedNetwork);
  }, [selectedNetwork, loadTransactions]);

  // Dashboard stats
  const stats = [
    {
      title: 'Total Transactions',
      value: (state.total || 0).toLocaleString(),
      icon: '📊',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Success Rate',
      value: '98.5%',
      icon: '✅',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'Network',
      value: selectedNetwork.charAt(0).toUpperCase() + selectedNetwork.slice(1),
      icon: '🌐',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Status',
      value: 'Live',
      icon: '🟢',
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="glass-effect border-b border-dark-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-xl sm:text-2xl font-bold gradient-text">Wallet Dashboard</h1>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <select
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value)}
                className="bg-dark-200 border border-dark-100 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              >
                <option value="ethereum">Ethereum</option>
                <option value="polygon">Polygon</option>
                <option value="bsc">BSC</option>
              </select>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Enter wallet address..."
                  value={walletInput}
                  onChange={(e) => setWalletInput(e.target.value)}
                  className="bg-dark-200 border border-dark-100 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-64 text-sm"
                />
                <button
                  onClick={handleConnectWallet}
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 text-sm whitespace-nowrap"
                  disabled={state.loading === 'loading'}
                >
                  {state.loading === 'loading' ? 'Loading...' : 'Connect'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Wallet Info */}
        {state.wallet && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 card">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold text-sm sm:text-base">Connected Wallet</h3>
                <code className="text-primary-400 text-xs sm:text-sm font-mono break-all">
                  {state.wallet.address}
                </code>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <div
              key={stat.title}
              className="card-hover p-4 sm:p-6 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                  <span className="text-lg sm:text-2xl">{stat.icon}</span>
                </div>
                <div className="text-right">
                  <p className="text-lg sm:text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-gray-400 text-xs sm:text-sm">{stat.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="space-y-4 sm:space-y-6">
          {state.loading === 'loading' && (
            <>
              <SkeletonStats />
              <SkeletonTable />
            </>
          )}
          
          {state.loading === 'error' && state.error && (
            <ErrorComponent error={state.error} onRetry={handleRetry} />
          )}
          
          {state.loading === 'success' && (
            <TransactionTable transactions={state.transactions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;