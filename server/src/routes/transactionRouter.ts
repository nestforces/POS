import express  from "express";
const router = express.Router()

import { createTransactionController, getTransactionController } from "../controllers/transactionController"

router.post("/", createTransactionController)
router.get("/code-transaction", getTransactionController)

export default router; 