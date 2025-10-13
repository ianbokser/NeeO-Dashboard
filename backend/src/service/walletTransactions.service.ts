import { BlockchainUtils } from '../utils/blockchain';

export const getWalletTransactions = async (wallet: string, fromBlock?: number, toBlock?: number): Promise<any[]> => {
    const transactions = await BlockchainUtils.fetchTransactionsFromBlockchain(wallet, fromBlock, toBlock);
    return transactions;
};