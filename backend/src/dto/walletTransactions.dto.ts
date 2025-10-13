import { z } from "zod";

export const walletTransactionsSchema = z.object({
  wallet: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address format"),
  fromBlock: z.coerce.number().int().nonnegative().optional(),
  toBlock: z.coerce.number().int().nonnegative().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50).optional(),
  pageCursor: z.string().optional(),
  reverse: z.coerce.boolean().default(false).optional(),
})
.refine(
  (data) =>
    data.fromBlock === undefined ||
    data.toBlock === undefined ||
    data.fromBlock <= data.toBlock,
  { path: ["toBlock"], message: "toBlock must be >= fromBlock" }
);

export type WalletTransactionsDto = z.infer<typeof walletTransactionsSchema>;
