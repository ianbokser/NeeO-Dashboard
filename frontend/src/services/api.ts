import axios from 'axios';
import { TransactionResponse, ApiError, Transaction } from '../types';

// Configure axios instance
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 30000, // Increased timeout to 30 seconds for blockchain APIs
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

// Retry function with exponential backoff
const retryRequest = async (fn: () => Promise<any>, maxRetries: number = 3): Promise<any> => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries;
      const isTimeoutError = error.code === 'ECONNABORTED' || error.message?.includes('timeout');
      const isNetworkError = error.code === 'NETWORK_ERROR' || !error.response;
      
      // Only retry on timeout or network errors
      if (isLastAttempt || (!isTimeoutError && !isNetworkError)) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      console.log(`Request failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

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
   * Fetch transactions for a specific wallet and network with retry logic
   */
  async getTransactions(
    wallet: string,
    network: string = 'ethereum',
    signal?: AbortSignal
  ): Promise<TransactionResponse> {
    const requestFn = () => api.get('/transactions', {
      params: {
        wallet,
        network,
      },
      signal, // Support for request cancellation
    });

    try {
      const response = await retryRequest(requestFn, 3);
      console.log('Fetched transactions:', response.data);
      
      const data = response.data;
      return {
        transactions: data.transactions || [],
        total: data.total || data.transactions?.length || 0,
        hasMore: data.hasMore || false,
        page: data.page,
        limit: data.limit
      };

    } catch (error: any) {
      // Don't retry if request was aborted
      if (signal?.aborted) {
        throw new Error('Request was cancelled');
      }
      throw error as ApiError;
    }
  },

  async getTransactionByHash(hash: string, network: string = 'ethereum', signal?: AbortSignal): Promise<Transaction> {
    const requestFn = () => api.get(`/transactions/${hash}`, {
      params: { network },
      signal,
    });

    try {
      const response = await retryRequest(requestFn, 2); // Fewer retries for single transaction
      return response.data;
    } catch (error: any) {
      if (signal?.aborted) {
        throw new Error('Request was cancelled');
      }
      throw error as ApiError;
    }
  },

  async getWalletBalance(wallet: string, network: string = 'ethereum', signal?: AbortSignal): Promise<{ balance: string }> {
    const requestFn = () => api.get('/wallet/balance', {
      params: {
        wallet,
        network,
      },
      signal,
    });

    try {
      const response = await retryRequest(requestFn, 2);
      return response.data;
    } catch (error: any) {
      if (signal?.aborted) {
        throw new Error('Request was cancelled');
      }
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