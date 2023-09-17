import jwt from "jsonwebtoken";

export async function authMidleware(req, res, next) {
    const secretKey = process.env.SECRET_KEY;
    let token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }
    console.log(token, "TOKEN")
    token = token.slice(7);
    try {
        const decoded = jwt.verify(token, secretKey);
        //La variable user, tiene el id con el que podemos obtener que usuario es.
        let user = (req.userId = decoded.userId);
        next();
    } catch (e) {
        res.status(401).json({ error: "Token is not valid" });
    }
}