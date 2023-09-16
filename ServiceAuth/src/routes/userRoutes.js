import express from "express";
import { registerUsersController, getUserController, verificationUsersController } from "../controllers/userController.js";
const router = express.Router();


router.post("/register", registerUsersController);
router.post("/verificationRegister", verificationUsersController)
router.get("/users", getUserController);


export default router;