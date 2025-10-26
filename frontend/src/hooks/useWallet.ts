import { useEffect, useCallback, useRef } from 'react';
import { useWalletContext } from '../contexts/WalletContext';
import { transactionService } from '../services/api';
import {
  initializeMetaMaskSDK,
  connectToMetaMask,
  getConnectedAccounts,
  switchChain as switchMetaMaskChain,
  addChainToWallet,
  setupMetaMaskEventListeners,
  disconnectFromMetaMask,
  getCurrentNetworkInfo,
} from '../config/MetaMask.Config';

/**
 * Custom hook para manejar todas las operaciones de wallet
 */
export const useWallet = () => {
  const { state, dispatch } = useWalletContext();
  
  // AbortController para cancelar peticiones en curso
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Ref para evitar múltiples llamadas simultáneas
  const loadingRef = useRef<boolean>(false);
  
  // Timeout para debouncing
  const debounceTimeoutRef = useRef<number | null>(null);

  /**
   * Cargar transacciones para la cuenta actual con debouncing y control de concurrencia
   */
  const loadTransactions = useCallback(async (immediate: boolean = false) => {
    if (!state.currentAccount || !state.currentChain) {
      return;
    }

    // Evitar múltiples llamadas simultáneas
    if (loadingRef.current && !immediate) {
      console.log('Transaction loading already in progress, skipping...');
      return;
    }

    // Cancelar timeout anterior si existe
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }

    // Si no es inmediato, aplicar debouncing
    if (!immediate) {
      debounceTimeoutRef.current = setTimeout(() => {
        loadTransactions(true);
      }, 500); // 500ms de debouncing
      return;
    }

    // Cancelar petición anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Crear nuevo AbortController
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    loadingRef.current = true;
    dispatch({ type: 'SET_TRANSACTIONS_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Mapear chainId a network name para la API
      let networkName = 'ethereum';
      switch (state.currentChain.chainId) {
        case '0x1':
          networkName = 'ethereum';
          break;
        case '0x89':
          networkName = 'polygon';
          break;
        case '0xa4b1':
          networkName = 'arbitrum';
          break;
        case '0x38':
          networkName = 'binance';
          break;
        default:
          networkName = 'ethereum';
      }

      console.log(`Loading transactions for ${state.currentAccount} on ${networkName}...`);
      
      const response = await transactionService.getTransactions(
        state.currentAccount,
        networkName,
        signal
      );

      // Verificar si la petición fue cancelada
      if (signal.aborted) {
        console.log('Transaction loading was cancelled');
        return;
      }

      dispatch({ type: 'SET_TRANSACTIONS', payload: response.transactions });
      console.log(`Successfully loaded ${response.transactions.length} transactions`);
      
    } catch (error: any) {
      if (signal.aborted || error.message?.includes('cancelled')) {
        console.log('Transaction loading was cancelled');
        return;
      }
      
      console.error('Error loading transactions:', error);
      dispatch({ type: 'SET_ERROR', payload: error as any });
    } finally {
      loadingRef.current = false;
      
      // Solo cambiar loading state si no fue cancelado
      if (!signal.aborted) {
        dispatch({ type: 'SET_TRANSACTIONS_LOADING', payload: false });
      }
    }
  }, [state.currentAccount, state.currentChain, dispatch]);

  /**
   * Conectar wallet
   */
  const connectWallet = useCallback(async () => {
    dispatch({ type: 'SET_CONNECTING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Inicializar SDK
      const sdk = initializeMetaMaskSDK();
      dispatch({ type: 'SET_SDK', payload: sdk });

      // Conectar y obtener cuentas
      const accounts = await connectToMetaMask();
      
      if (accounts && accounts.length > 0) {
        // Actualizar cuentas
        const accountsList = accounts.map(address => ({
          address,
          isActive: address === accounts[0],
        }));
        
        dispatch({ type: 'SET_ACCOUNTS', payload: accountsList });
        dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: accounts[0] });
        dispatch({ type: 'SET_CONNECTED', payload: true });

        // Obtener y establecer la chain actual
        const chainInfo = await getCurrentNetworkInfo();
        
        if (chainInfo) {
          dispatch({ type: 'SET_CURRENT_CHAIN', payload: chainInfo });
        }

        // Cargar transacciones automáticamente con un pequeño delay
        setTimeout(() => {
          loadTransactions(true); // immediate = true para evitar debouncing en conexión inicial
        }, 1000); // Aumentado a 1 segundo para dar tiempo a la conexión
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      dispatch({ type: 'SET_ERROR', payload: `Failed to connect wallet: ${error}` });
    } finally {
      dispatch({ type: 'SET_CONNECTING', payload: false });
    }
  }, [dispatch, loadTransactions]);

  /**
   * Desconectar wallet
   */
  const disconnectWallet = useCallback(async () => {
    try {
      await disconnectFromMetaMask();
      dispatch({ type: 'RESET_WALLET' });
      
      // Limpiar localStorage
      localStorage.removeItem('wallet-state');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }, [dispatch]);

  /**
   * Cambiar de chain
   */
  const switchChain = useCallback(async (chainId: string) => {
    if (!state.isConnected) {
      throw new Error('Wallet not connected');
    }

    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      await switchMetaMaskChain(chainId);
      
      // Actualizar estado con la nueva chain
      const chainInfo = state.availableChains.find(c => c.chainId === chainId);
      if (chainInfo) {
        dispatch({ type: 'SET_CURRENT_CHAIN', payload: chainInfo });
        
        // Recargar transacciones para la nueva chain
        setTimeout(() => {
          loadTransactions(true); // immediate = true para cambio de chain
        }, 500);
      }
    } catch (error) {
      console.error('Error switching chain:', error);
      dispatch({ type: 'SET_ERROR', payload: `Failed to switch chain: ${error}` });
      throw error;
    }
  }, [state.isConnected, state.availableChains, dispatch, loadTransactions]);

  /**
   * Agregar chain personalizada
   */
  const addCustomChain = useCallback(async (chainInfo: any) => {
    if (!state.isConnected) {
      throw new Error('Wallet not connected');
    }

    try {
      await addChainToWallet(chainInfo);
      
      // Agregar al estado local
      const updatedChains = [...state.availableChains, chainInfo];
      dispatch({ type: 'SET_AVAILABLE_CHAINS', payload: updatedChains });
    } catch (error) {
      console.error('Error adding custom chain:', error);
      throw error;
    }
  }, [state.isConnected, state.availableChains, dispatch]);

  /**
   * Cambiar de cuenta
   */
  const switchAccount = useCallback(async (accountAddress: string) => {
    if (!state.isConnected) {
      throw new Error('Wallet not connected');
    }

    // Verificar que la cuenta esté en la lista de cuentas conectadas
    const account = state.accounts.find(acc => acc.address.toLowerCase() === accountAddress.toLowerCase());
    if (!account) {
      throw new Error('Account not found in connected accounts');
    }

    // Actualizar cuenta activa
    const updatedAccounts = state.accounts.map(acc => ({
      ...acc,
      isActive: acc.address.toLowerCase() === accountAddress.toLowerCase(),
    }));

    dispatch({ type: 'SET_ACCOUNTS', payload: updatedAccounts });
    dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: accountAddress });

    // Recargar transacciones para la nueva cuenta
    setTimeout(() => {
      loadTransactions(true); // immediate = true para cambio de cuenta
    }, 500);
  }, [state.isConnected, state.accounts, dispatch, loadTransactions]);

  /**
   * Refrescar datos de la wallet
   */
  const refreshWalletData = useCallback(async () => {
    if (!state.isConnected) {
      return;
    }

    try {
      // Actualizar cuentas
      const accounts = await getConnectedAccounts();
      if (accounts && accounts.length > 0) {
        const accountsList = accounts.map(address => ({
          address,
          isActive: address === state.currentAccount,
        }));
        dispatch({ type: 'SET_ACCOUNTS', payload: accountsList });
      }

      // Actualizar chain
      const chainInfo = await getCurrentNetworkInfo();
      if (chainInfo) {
        dispatch({ type: 'SET_CURRENT_CHAIN', payload: chainInfo });
      }

      // Recargar transacciones
      await loadTransactions(true); // immediate = true para refresh manual
    } catch (error) {
      console.error('Error refreshing wallet data:', error);
    }
  }, [state.isConnected, state.currentAccount, dispatch, loadTransactions]);

  /**
   * Verificar conexión existente al cargar
   */
  const checkExistingConnection = useCallback(async () => {
    try {
      const accounts = await getConnectedAccounts();
      
      if (accounts && accounts.length > 0) {
        // Hay una conexión existente
        const accountsList = accounts.map(address => ({
          address,
          isActive: address === accounts[0],
        }));

        dispatch({ type: 'SET_ACCOUNTS', payload: accountsList });
        dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: accounts[0] });
        dispatch({ type: 'SET_CONNECTED', payload: true });

        // Inicializar SDK
        const sdk = initializeMetaMaskSDK();
        dispatch({ type: 'SET_SDK', payload: sdk });

        // Obtener chain info
        const chainInfo = await getCurrentNetworkInfo();
        if (chainInfo) {
          dispatch({ type: 'SET_CURRENT_CHAIN', payload: chainInfo });
        }

        // Cargar transacciones
        setTimeout(() => {
          loadTransactions(true); // immediate = true para conexión existente
        }, 1000);
      }
    } catch (error) {
      console.error('Error checking existing connection:', error);
    }
  }, [dispatch, loadTransactions]);

  /**
   * Configurar event listeners de MetaMask
   */
  useEffect(() => {
    if (!state.isConnected) {
      return;
    }

    const cleanup = setupMetaMaskEventListeners({
      onAccountsChanged: (accounts: string[]) => {
        if (accounts.length === 0) {
          // Desconectado
          dispatch({ type: 'RESET_WALLET' });
        } else {
          // Cambio de cuentas
          const accountsList = accounts.map(address => ({
            address,
            isActive: address === accounts[0],
          }));
          
          dispatch({ type: 'SET_ACCOUNTS', payload: accountsList });
          dispatch({ type: 'SET_CURRENT_ACCOUNT', payload: accounts[0] });
          
          // Recargar transacciones
          setTimeout(() => {
            loadTransactions(true); // immediate = true para cambio de cuenta
          }, 500);
        }
      },
      onChainChanged: async (chainId: string) => {
        const chainInfo = state.availableChains.find(c => c.chainId === chainId);
        if (chainInfo) {
          dispatch({ type: 'SET_CURRENT_CHAIN', payload: chainInfo });
          
          // Recargar transacciones para la nueva chain
          setTimeout(() => {
            loadTransactions(true); // immediate = true para cambio de chain
          }, 500);
        }
      },
      onConnect: (connectInfo) => {
        console.log('MetaMask connected:', connectInfo);
      },
      onDisconnect: () => {
        dispatch({ type: 'RESET_WALLET' });
      },
    });

    return cleanup;
  }, [state.isConnected, state.availableChains, dispatch, loadTransactions]);

  /**
   * Cleanup effect para cancelar peticiones y timeouts
   */
  useEffect(() => {
    return () => {
      // Cancelar petición en curso
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Cancelar timeout de debouncing
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Verificar conexión existente al montar el componente
   */
  useEffect(() => {
    checkExistingConnection();
  }, [checkExistingConnection]);

  return {
    // Estado
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    currentAccount: state.currentAccount,
    accounts: state.accounts,
    currentChain: state.currentChain,
    availableChains: state.availableChains,
    transactions: state.transactions,
    transactionsLoading: state.transactionsLoading,
    error: state.error,

    // Acciones
    connectWallet,
    disconnectWallet,
    switchChain,
    switchAccount,
    addCustomChain,
    loadTransactions,
    refreshWalletData,

    // Helpers
    getNetworkName: () => {
      switch (state.currentChain?.chainId) {
        case '0x1':
          return 'Ethereum';
        case '0x89':
          return 'Polygon';
        case '0xa4b1':
          return 'Arbitrum';
        case '0x38':
          return 'BSC';
        default:
          return 'Unknown';
      }
    },
    
    getShortAddress: (address?: string) => {
      const addr = address || state.currentAccount;
      if (!addr) return '';
      return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    },

    isAccountActive: (address: string) => {
      return state.currentAccount?.toLowerCase() === address.toLowerCase();
    },
  };
};