import express from "express";
import { getTransactions } from "./controller/transactions.controller";


const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/api/transactions", getTransactions);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
