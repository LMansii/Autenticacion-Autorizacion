import { getUsersModels, registerUsersModels, verificationRegisterUserModels, updateUsersModels, deleteUsersModels,loginUsersModel } from "../models/userModel.js"
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//PATH = /register
export async function registerUsersController(req, res) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword
        const result = await registerUsersModels(req.body);
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

//PATH = /verificationRegister
export async function verificationUsersController(req, res) {
    try {
        const verificationUserModels = await verificationRegisterUserModels(req.body.email, req.body.codeVerification)
        console.log(verificationUserModels, "verificationUserModels")
        if (verificationUserModels.status === "success") {
            console.log("dentro del if", verificationUserModels)
            return res.status(201).json(verificationUserModels);
        } else {
            return res.status(400).json(verificationUserModels);
        }
    } catch (error) {
        res.status(500).json({ status: "error", data: [], message: "Error interno del servidor" });
    }
}

//PATH = /users
export async function getUserController(req, res) {
    try {
        const id = Number(req.query.id) || undefined;
        const email = req.query.email || undefined;
        const result = await getUsersModels(id, email);

        if (result.status === "success") {
            return res.status(200).json(result);
        } else if (result.status === "error" && result.message === "Usuario no encontrado") {
            return res.status(404).json(result);
        } else {
            return res.status(500).json(result);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", data: [], message: "Error interno del servidor" });
    }
}


export async function updateUsersController(req, res) {
    try {
        const updateUser = await updateUsersModels(Number(req.query.id), req.body)
        if (updateUser.status === "success") {
            return res.status(200).json(updateUser);
        } else {
            return res.status(404).json(updateUser);
        }
    } catch (error) {
        res.status(500).json({ status: "error", data: [], message: "Error interno del servidor" });
    }
}


export async function deleteUsersController(req, res) {
    try {
        const deleteUser = await deleteUsersModels(Number(req.query.id))
        if (deleteUser.status === "success") {
            return res.status(200).json(deleteUser);
        } else {
            return res.status(404).json(deleteUser);
        }
    } catch (error) {
        res.status(500).json({ status: "error", data: [], message: "Error interno del servidor" });
    }
}


export async function loginUsersController(req, res) {
    try {
        const loginUser = await loginUsersModel(req.body)
        if (loginUser.status === "success") {
            return res.status(200).json(loginUser);
        } else {
            return res.status(404).json(loginUser);
        }
    } catch (error) {
        res.status(500).json({ status: "error", data: [], message: "Error interno del servidor" });
    }
}