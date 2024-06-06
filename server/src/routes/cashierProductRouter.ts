import express  from "express";
const router = express.Router()

import { getCashierProductController } from "../controllers/cashierProductController"

router.get("/", getCashierProductController)

export default router; 