import express from "express";
import { createPermissionController, getPermissionController, updatePermissionController, deletePermissionController } from "../controllers/permissionController.js";
const router = express.Router();

router.post("/createPermission", createPermissionController);
router.get("/getPermission", getPermissionController);
router.put("/updatePermission", updatePermissionController);
router.put("/deletePermission", deletePermissionController);
export default router;