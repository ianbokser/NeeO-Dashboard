import React, { useState } from 'react';
import { TransactionTable, ErrorComponent, LoadingWithRetry } from '../components';
import { SkeletonStats } from '../components/Skeleton';
import { useWallet } from '../hooks/useWallet';

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const {
    isConnected,
    currentAccount,
    transactions,
    transactionsLoading,
    error,
    connectWallet,
    refreshWalletData,
    getNetworkName,
  } = useWallet();

  // Handle retry
  const handleRetry = () => {
    if (isConnected) {
      refreshWalletData();
    }
  };

  // Dashboard stats
  const stats = [
    {
      title: 'Total Transactions',
      value: transactions.length.toLocaleString(),
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
      value: getNetworkName(),
      icon: '🌐',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Status',
      value: isConnected ? 'Connected' : 'Disconnected',
      icon: isConnected ? '🟢' : '🔴',
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  // Render cuando no hay wallet conectada
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-dark-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Connect Your Wallet</h1>
              <p className="text-gray-400 mb-8">
                Connect your MetaMask wallet to view your transactions and manage your portfolio across multiple networks.
              </p>
              <button
                onClick={connectWallet}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Connect Wallet
              </button>
            </div>
            
            {error && (
              <div className="p-4 bg-red-900/50 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">
                  {typeof error === 'string' ? error : error.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

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

            <div className="flex items-center space-x-4">
              <button
                onClick={refreshWalletData}
                disabled={transactionsLoading}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg transition-colors duration-200 text-sm"
              >
                {transactionsLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Wallet Info */}
        {currentAccount && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 card">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-accent-cyan rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-semibold text-sm sm:text-base">Connected Wallet</h3>
                <code className="text-primary-400 text-xs sm:text-sm font-mono break-all">
                  {currentAccount}
                </code>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-gray-400 text-xs">Network:</span>
                  <span className="text-primary-400 text-xs font-semibold">{getNetworkName()}</span>
                </div>
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
          {transactionsLoading && (
            <>
              <SkeletonStats />
              <SkeletonTable />
            </>
          )}
          
          {!transactionsLoading && error && (
            <ErrorComponent 
              error={typeof error === 'string' ? { message: error } : error} 
              onRetry={handleRetry} 
            />
          )}
          
          {!transactionsLoading && !error && (
            <TransactionTable transactions={transactions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;