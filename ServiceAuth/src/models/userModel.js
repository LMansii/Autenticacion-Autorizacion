import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer"
const prisma = new PrismaClient();
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

//------------- FUNCTIONS -------------
function generateRandomCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
}
//Bien a tener en cuente lo siguiente, realmente se email no te llegaria al email que estas indicando por el simple hecho que no indicamos desde donde queres que salga el email, en este caso
//solo estamos usando un servicio de envios de email y este email se encuentra en la bandeja de entrada de este servicio 
//para que funcione debenmos usar el serivcio de gmail y propocionar una cuenta de gmail con sus dichas credenciales para que si llegue al email que esta pasado por argumento.
async function sendEmialVerificationCode(email, code) {
    try {
        var transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: 'sandbox.smtp.mailtrap.io', // Remitente
            to: email, // Destinatario
            subject: 'Correo de prueba', // Asunto
            text: code, // Cuerpo del correo
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error al enviar el correo electrónico:', error);
            } else {
                console.log('Correo electrónico enviado:', info.response);
            }
        });
    } catch (error) {
        throw error
    }
}

export async function registerUsersModels(data) {
    try {
        const codeVerification = generateRandomCode()
        data.codeVerification = codeVerification
        const findUserEmail = await prisma.User.findMany({
            where: {
                email: data.email,
            },
        });
        if (findUserEmail.length > 0) {
            return { status: "error", data: [], message: "El email ya se encuentra registrado." };
        } else {
            const createUser = await prisma.user.create({ data: data })

            sendEmialVerificationCode(createUser.email, createUser.codeVerification)
            return { status: "success", data: createUser, message: "Usuario registrado con éxito, le llegara un email para verificar" };

        }
    } catch (error) {
        console.error(error); // Registra el error en la consola para depuración
        throw error; // Re-lanza la excepción para que sea manejada en el controlador
    }
}


//------------- FUNCTION MODELS -------------
export async function verificationRegisterUserModels(email, codeVerification) {
    try {
        const findUserEmail = await prisma.User.findMany({
            where: {
                email: email,
                statusAccountVerification: 1
            },
        });
        if (findUserEmail.length > 0) {
            return { status: "error", data: [], message: "El email ya se encuentra verificado!" };
        } else {
            const findUserEmailVerification = await prisma.User.findMany({
                where: {
                    email: email,
                },
            });
            if (findUserEmailVerification[0].codeVerification === codeVerification) {
                const verificationUser = await prisma.User.update({
                    where: {
                        email: email,
                        codeVerification: codeVerification
                    },
                    data: {
                        statusAccountVerification: 1
                    }
                });
                return { status: "success", data: verificationUser, message: "Usuario verificado con exito!" };
            }
        }
    } catch (error) {
        console.log(error)
        throw error; // Re-lanza la excepción para que sea manejada en el controlador
    }
}

export async function getUsersModels(id, email, page, limit) {
    try {
        let whereClause = { status: 1 };
        let message = "";

        //paginado
        const totalUsers = await prisma.User.count({
            where: {
                status: 1
            }
        })
        let idOEmail = false;
        let paginas = totalUsers / limit;
        let entero = Math.trunc(paginas)
        let calculo = paginas - entero
        if (calculo > 0) {
            entero = entero + 1;
            paginas = entero;
        }
        //FIN - paginado
        let skip = Number(page) * Number(limit)
        let take = Number(limit)
        if (id !== undefined) {
            whereClause.id = Number(id);
            message = "Usuario encontrado con éxito";
            skip = 0
            take = 1
            idOEmail = true
        }

        if (email !== undefined) {
            whereClause.email = email;
            message = "Usuario encontrado con éxito";
            skip = 0
            take = 1
            idOEmail = true
        }

        const users = await prisma.user.findMany({
            skip: skip,
            take: take,
            where: whereClause,
            orderBy: {
                id: 'asc',
            },
        });

        if (users.length > 0) {
            if (!idOEmail) {
                users.unshift({ pagination: paginas })
            }
            return { status: "success", data: users, message };
        } else {
            return { status: "error", data: [], message: "Usuario no encontrado" };
        }
    } catch (error) {
        console.error(error);
        return { status: "error", data: [], message: "Error interno del servidor" };
    }
}


export async function updateUsersModels(id, data) {
    try {
        if (id === undefined || data === undefined) {
            return { status: "error", data: [], message: "Faltan datos!" };
        }
        const updateUser = await prisma.User.update({
            where: {
                id: id
            },
            data: data
        })

        if (!updateUser) {
            // Si updateUser es null o undefined, significa que no se pudo editar el usuario.
            return { status: "error", data: [], message: "Ocurrió un error al modificar!" };
        }

        return { status: "success", data: updateUser, message: "Usuario modificado con exito!" };


    } catch (error) {
        console.log(error)
        throw error; // Re-lanza la excepción para que sea manejada en el controlador
    }
}

export async function deleteUsersModels(id) {
    try {
        if (id === undefined) {
            return { status: "error", data: [], message: "Faltan datos!" };
        }
        const deleteUser = await prisma.User.update({
            where: {
                id: id
            },
            data: {
                status: 0
            }
        })

        if (!deleteUser) {
            // Si updateUser es null o undefined, significa que no se pudo editar el usuario.
            return { status: "error", data: [], message: "Ocurrió un error al eliminar!" };
        }

        return { status: "success", data: deleteUser, message: "Usuario eliminado con exito!" };

    } catch (error) {
        console.log(error)
        throw error; // Re-lanza la excepción para que sea manejada en el controlador
    }
}

export async function loginUsersModel(data) {
    try {
        const { email, password } = data;
        const secretKey = process.env.SECRET_KEY;
        if (email === undefined || password === undefined) {
            return { status: "error", data: [], message: "Faltan datos!" };
        }
        const findUserEmail = await prisma.User.findMany({
            where: {
                status: 1,
                email: email
            },
        })
        if (findUserEmail.length === 0) {
            return findUserEmail;
        }
        const passwordMatch = await bcrypt.compare(password, findUserEmail[0].password);
        if (!passwordMatch) {
            return { status: "error", data: [], message: "Contraseña incorrecta!" };
        }
        const token = Jwt.sign({ userId: findUserEmail[0].id }, secretKey, {
            expiresIn: process.env.TIME_TOKEN_JWT,
        });
        return { status: "success", data: token, message: "Usuario logeado con exito!" };
    } catch (error) {
        console.log(error)
        throw error; // Re-lanza la excepción para que sea manejada en el controlador
    }
}