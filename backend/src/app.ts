import express from "express"
import { HypersyncClient } from "@envio-dev/hypersync-client"
import { isExpression } from "typescript";
import { getTransactions } from "./controller/transactions.controller";


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/api/transactions/:wallet", getTransactions);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
