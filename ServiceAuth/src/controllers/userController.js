import { getUsersModels, registerUsersModels, verificationRegisterUserModels } from "../models/userModel.js"
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


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


export async function getUserController(req, res) {
    try {
        const id = req.query.id || undefined;
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

