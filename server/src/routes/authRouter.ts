import express from "express";
import { body } from "express-validator";
const router = express.Router()

import { registerController, loginController, keepLoginController, forgotPasswordController, setPasswordController} from "../controllers/authController";
import validator from "../middleware/validator";
import verifyToken from "../middleware/auth";
import checkRoles from "../middleware/auth";
import checkUserStatus from "../middleware/checkUserStatus";

const validations = [
    body("email").notEmpty().withMessage("Email cannot be emptied"),
    body("email").isEmail().withMessage("Email format is invalid"), 
    body("password").notEmpty().withMessage("Password cannot be emptied")
]

router.post("/addcashier", checkRoles, registerController);
router.patch("/forgot-password", forgotPasswordController);
router.patch("/reset-password", setPasswordController);
router.post("/login", validator(validations), checkUserStatus, loginController);
router.get("/keep-login", verifyToken, keepLoginController);

export default router