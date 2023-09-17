import express from "express";
import { createRoleController, getRoleController, updateRoleController, deleteRoleController } from "../controllers/roleController.js";
const router = express.Router();

router.post("/createRole", createRoleController);
router.get("/getRole", getRoleController);
router.put("/updateRole", updateRoleController);
router.put("/deleteRole", deleteRoleController);
export default router;