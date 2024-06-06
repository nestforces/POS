import express from "express";
const router = express.Router()


import { findCashierController, updateCashierController, deleteCashierController } from "../controllers/userController";
import checkRoles from "../middleware/auth"


router.get("/cashier", checkRoles, findCashierController);
router.patch("/updatecashier/:id", checkRoles, updateCashierController);
router.delete("/deletecashier/:id", checkRoles, deleteCashierController);



export default router