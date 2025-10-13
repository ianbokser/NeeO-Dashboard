import { HypersyncClient, JoinMode } from "@envio-dev/hypersync-client";
import { TransactionField, BlockField } from "@envio-dev/hypersync-client"; 

export class BlockchainUtils {
    static async fetchTransactionsFromBlockchain(wallet: string, networkUrl: string, fromBlock?: number, toBlock?: number): Promise<any[]> {
    const client = HypersyncClient.new({
      url: networkUrl,
    });

    // Query para transacciones donde tu wallet es el remitente O el destinatario
    const query: any = {
      transactions: [
        // Transacciones donde tu wallet es el remitente
        {
          from: [wallet.toLowerCase()],
        },
        // Transacciones donde tu wallet es el destinatario
        {
          to: [wallet.toLowerCase()],
        },
      ],
      fieldSelection: {
        transaction: [
          TransactionField.Hash,
          TransactionField.From,
          TransactionField.To,
          TransactionField.Value,
          TransactionField.Status,
          TransactionField.Input,
          TransactionField.BlockNumber
        ],
        block: [
          BlockField.Number,
          BlockField.Timestamp
        ]
      },
      joinMode: JoinMode.JoinAll,
    };

    query.fromBlock = fromBlock !== undefined ? fromBlock : 1;
    
    if (toBlock !== undefined && toBlock !== null) {
      query.toBlock = toBlock;
    }
    
    const resultTxs: any[] = [];

    const stream = await client.stream(query, { reverse: true });
    try {
      while (true) {
        const res = await stream.recv();
        if (!res) break; 

        if (res.data && res.data.transactions) {
          for (const tx of res.data.transactions) {
            const block = res.data.blocks?.find(b => b.number === tx.blockNumber);
            const blockTimestamp = block?.timestamp;
            
            resultTxs.push({
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              value: tx.value?.toString(),
              status: tx.status,
              input: tx.input,
              blockNumber: tx.blockNumber,
              timestamp: blockTimestamp,
            });
          }
        }
      }
    } finally {
      await stream.close?.();
    }

    return resultTxs;
    }
}