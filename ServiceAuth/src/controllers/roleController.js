import { createRole, getRole, updateRole, deleteRole } from "../models/roleModel.js"

//PATH = /createRole
export async function createRoleController(req, res) {
    try {
        const result = await createRole(req.body)
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

//PATH = /getRole
export async function getRoleController(req, res) {
    try {
        const id = Number(req.query.id) || undefined;
        const page = req.query.page;
        const limit = req.query.limit;
        const result = await getRole(id, page, limit)
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

//PATH = /updateRole
export async function updateRoleController(req, res) {
    try {
        const result = await updateRole(Number(req.query.id), req.body)
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

//PATH = /deleteRole
export async function deleteRoleController(req, res) {
    try {
        Number(req.query.id)
        const result = await deleteRole(req.body)
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