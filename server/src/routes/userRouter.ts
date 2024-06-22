import express from "express";
const router = express.Router()


import { findCashierController, updateCashierController, deleteCashierController, updateAvatarController } from "../controllers/userController";
import checkRoles from "../middleware/auth"
import { uploadAvatarFile } from "../middleware/multerConfig";


router.get("/cashier", checkRoles, findCashierController);
router.patch("/updatecashier/:id", checkRoles, updateCashierController);
router.delete("/deletecashier/:id", checkRoles, deleteCashierController);
router.patch("/upload-avatar/:id", uploadAvatarFile, updateAvatarController);


export default router