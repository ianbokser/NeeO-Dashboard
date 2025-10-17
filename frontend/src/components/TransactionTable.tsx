import React from 'react';
import { Transaction } from '../types';

interface TransactionTableProps {
  transactions: Transaction[];
  loading?: boolean;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, loading = false }) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatValue = (value: string) => {
    const eth = parseFloat(value) / 1e18;
    return eth.toFixed(4);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status?: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    
    switch (status) {
      case 'success':
        return `${baseClasses} bg-emerald-500/20 text-emerald-400 border border-emerald-500/30`;
      case 'failed':
        return `${baseClasses} bg-red-500/20 text-red-400 border border-red-500/30`;
      case 'pending':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400 border border-gray-500/30`;
    }
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-dark-100 rounded mb-4"></div>
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex space-x-4 mb-4">
              <div className="h-4 bg-dark-100 rounded flex-1"></div>
              <div className="h-4 bg-dark-100 rounded flex-1"></div>
              <div className="h-4 bg-dark-100 rounded flex-1"></div>
              <div className="h-4 bg-dark-100 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="card p-6 sm:p-8 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-dark-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-medium text-gray-300 mb-2">No transactions found</h3>
        <p className="text-sm text-gray-500">Connect your wallet or check your network connection</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-dark-100">
        <h2 className="text-lg sm:text-xl font-semibold text-white">Recent Transactions</h2>
        <p className="text-gray-400 text-sm mt-1">{transactions.length} transactions found</p>
      </div>
      
      {/* Mobile Card View */}
      <div className="block lg:hidden">
        <div className="divide-y divide-dark-100">
          {transactions.map((tx, index) => (
            <div 
              key={tx.hash} 
              className="p-4 hover:bg-dark-100/50 transition-colors duration-150 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Hash</span>
                  <code className="text-primary-400 bg-primary-500/10 px-2 py-1 rounded text-xs font-mono">
                    {formatAddress(tx.hash)}
                  </code>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">From</span>
                    <code className="text-gray-300 text-xs font-mono">{formatAddress(tx.from)}</code>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">To</span>
                    <code className="text-gray-300 text-xs font-mono">{formatAddress(tx.to)}</code>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Value</span>
                    <span className="text-accent-cyan font-medium text-sm">{formatValue(tx.value)} ETH</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Status</span>
                    <span className={getStatusBadge(tx.status)}>
                      {tx.status || 'unknown'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Date</span>
                  <span className="text-sm text-gray-400">{formatDate(tx.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dark-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Transaction Hash
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                From
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Value (ETH)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-100">
            {transactions.map((tx, index) => (
              <tr 
                key={tx.hash} 
                className="hover:bg-dark-100/50 transition-colors duration-150 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <code className="text-primary-400 bg-primary-500/10 px-2 py-1 rounded text-sm font-mono">
                      {formatAddress(tx.hash)}
                    </code>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-gray-300 text-sm font-mono">
                    {formatAddress(tx.from)}
                  </code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-gray-300 text-sm font-mono">
                    {formatAddress(tx.to)}
                  </code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-accent-cyan font-medium">
                    {formatValue(tx.value)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(tx.status)}>
                    {tx.status || 'unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {formatDate(tx.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;