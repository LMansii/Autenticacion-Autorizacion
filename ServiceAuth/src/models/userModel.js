import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer"
const prisma = new PrismaClient();

// {
//     "status": "success",
//     "data": {
//         // Datos relevantes aquí
//     },
//     "message": "Operación exitosa"
// }
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
        console.log(data, "data")
        const codeVerification = generateRandomCode()
        data.codeVerification = codeVerification
        const findUserEmail = await prisma.User.findMany({
            where: {
                email: data.email,
            },
        });
        console.log(findUserEmail, "findUserEmail")
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

export async function getUsersModels(id, email) {
    try {
        let whereClause = {};
        let message = "";

        if (id !== undefined) {
            whereClause.id = Number(id);
            message = "Usuario encontrado con éxito";
        }

        if (email !== undefined) {
            whereClause.email = email;
            message = "Usuario encontrado con éxito";
        }

        const users = await prisma.user.findMany({
            where: whereClause,
        });

        if (users.length > 0) {
            return { status: "success", data: users, message };
        } else {
            return { status: "error", data: [], message: "Usuario no encontrado" };
        }
    } catch (error) {
        console.error(error);
        return { status: "error", data: [], message: "Error interno del servidor" };
    }
}


