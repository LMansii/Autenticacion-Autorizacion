import express from "express";
import { registerUsersController, getUserController, verificationUsersController, updateUsersController, deleteUsersController, loginUsersController } from "../controllers/userController.js";
const router = express.Router();


router.post("/register", registerUsersController);
router.post("/verificationRegister", verificationUsersController)
router.get("/users", getUserController);
router.put("/updateUser", updateUsersController);
router.put("/deleteUser", deleteUsersController);
router.post("/login", loginUsersController)

export default router;