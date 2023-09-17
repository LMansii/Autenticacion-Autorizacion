import { createPermission, getPermission, updatePermission, deletePermission } from "../models/perrmissionModel.js";


//PATH = /createPermission
export async function createPermissionController(req, res) {
    try {
        const result = await createPermission(req.body)
        console.log(result, "result")
        if (result.status === "success") {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ status: "error", data: [], message: "Error interno del servidor" });
    }
}

//PATH = /getPermission
export async function getPermissionController(req, res) {
    try {
        const id = Number(req.query.id) || undefined;
        const result = await getPermission(id)
        console.log(result, "result")
        if (result.status === "success") {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ status: "error", data: [], message: "Error interno del servidor" });
    }
}

//PATH = /updatePermission
export async function updatePermissionController(req, res) {
    try {
        const result = await updatePermission(Number(req.query.id), req.body)
        console.log(result, "result")
        if (result.status === "success") {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ status: "error", data: [], message: "Error interno del servidor" });
    }
}

//PATH = /deletePermission
export async function deletePermissionController(req, res) {
    try {
        Number(req.query.id)
        const result = await deletePermission(req.body)
        console.log(result, "result")
        if (result.status === "success") {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ status: "error", data: [], message: "Error interno del servidor" });
    }
}