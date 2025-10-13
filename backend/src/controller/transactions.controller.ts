import { Request, Response } from 'express';
import { getWalletTransactions } from '../service/walletTransactions.service';

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { wallet, fromBlock, toBlock, limit, pageCursor } = req.query;
        
        if (!wallet || typeof wallet !== 'string') {
            res.status(400).json({ 
                error: 'Wallet parameter is required and must be a string' 
            });
            return;
        }

        const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(wallet);
        if (!isValidAddress) {
            res.status(400).json({ 
                error: 'Invalid wallet address format. Must be a valid Ethereum address' 
            });
            return;
        }
        let parsedFromBlock: number | undefined;
        let parsedToBlock: number | undefined;
        let parsedLimit: number | undefined;

        if (fromBlock) {
            parsedFromBlock = parseInt(fromBlock as string, 10);
            if (isNaN(parsedFromBlock) || parsedFromBlock < 0) {
                res.status(400).json({ 
                    error: 'fromBlock must be a valid non-negative number' 
                });
                return;
            }
        }

        if (toBlock) {
            parsedToBlock = parseInt(toBlock as string, 10);
            if (isNaN(parsedToBlock) || parsedToBlock < 0) {
                res.status(400).json({ 
                    error: 'toBlock must be a valid non-negative number' 
                });
                return;
            }
        }

        if (limit) {
            parsedLimit = parseInt(limit as string, 10);
            if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
                res.status(400).json({ 
                    error: 'limit must be a number between 1 and 100' 
                });
                return;
            }
        }

        if (parsedFromBlock !== undefined && parsedToBlock !== undefined && parsedFromBlock > parsedToBlock) {
            res.status(400).json({ 
                error: 'fromBlock must be less than or equal to toBlock' 
            });
            return;
        }

        const params = {
            wallet,
            fromBlock: parsedFromBlock,
            toBlock: parsedToBlock,
            limit: parsedLimit || 50,
            pageCursor: pageCursor as string | undefined
        };

        const transactions = await getWalletTransactions(wallet, parsedFromBlock, parsedToBlock);
        
        res.status(200).json({
            success: true,
            wallet: wallet,
            fromBlock: parsedFromBlock,
            toBlock: parsedToBlock,
            limit: parsedLimit || 50,
            pageCursor: pageCursor as string | undefined,
            transactions: transactions
        });

    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};