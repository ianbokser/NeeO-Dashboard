import axios from 'axios';
import { TransactionResponse, ApiError, Transaction } from '../types';

// Configure axios instance
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      code: error.response?.data?.code || error.code,
      status: error.response?.status,
    };
    
    console.error('API Error:', apiError);
    return Promise.reject(apiError);
  }
);

// API service functions
export const transactionService = {
  /**
   * Fetch transactions for a specific wallet and network
   */
  async getTransactions(
    wallet: string,
    network: string = 'ethereum',
  ): Promise<TransactionResponse> {
    try {
      const response = await api.get('/transactions', {
        params: {
          wallet,
          network,
        },
      });
      console.log('Fetched transactions:', response.data);
      
      const data = response.data;
      return {
        transactions: data.transactions || [],
        total: data.total || data.transactions?.length || 0,
        hasMore: data.hasMore || false,
        page: data.page,
        limit: data.limit
      };

    } catch (error) {
      throw error as ApiError;
    }
  },

  async getTransactionByHash(hash: string, network: string = 'ethereum'): Promise<Transaction> {
    try {
      const response = await api.get(`/transactions/${hash}`, {
        params: { network },
      });

      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  async getWalletBalance(wallet: string, network: string = 'ethereum'): Promise<{ balance: string }> {
    try {
      const response = await api.get('/wallet/balance', {
        params: {
          wallet,
          network,
        },
      });

      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },
};

export const networks = {
  ethereum: {
    name: 'Ethereum',
    symbol: 'ETH',
    chainId: 1,
    explorer: 'https://etherscan.io',
  },
  polygon: {
    name: 'Polygon',
    symbol: 'MATIC',
    chainId: 137,
    explorer: 'https://polygonscan.com',
  },
  bsc: {
    name: 'Binance Smart Chain',
    symbol: 'BNB',
    chainId: 56,
    explorer: 'https://bscscan.com',
  },
};

// Utility functions
export const utils = {
  /**
   * Format wallet address for display
   */
  formatAddress: (address: string, length: number = 8): string => {
    if (!address) return '';
    const start = address.slice(0, 2 + length / 2);
    const end = address.slice(-(length / 2));
    return `${start}...${end}`;
  },

  /**
   * Format value from Wei to Ether
   */
  formatEther: (value: string | number): string => {
    const eth = parseFloat(value.toString()) / 1e18;
    return eth.toFixed(6);
  },

  /**
   * Format timestamp to readable date
   */
  formatDate: (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString();
  },

  /**
   * Get explorer URL for transaction
   */
  getExplorerUrl: (hash: string, network: string = 'ethereum'): string => {
    const networkInfo = networks[network as keyof typeof networks];
    return `${networkInfo?.explorer}/tx/${hash}`;
  },
};

export default api;