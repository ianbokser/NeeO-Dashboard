import express from "express";
import cors from "cors";
import { getTransactions } from "./controller/transactions.controller";


const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/api/transactions", getTransactions);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
