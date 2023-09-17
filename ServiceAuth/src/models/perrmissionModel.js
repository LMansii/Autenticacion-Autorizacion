import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//------------- FUNCTIONS -------------


//------------- FUNCTION MODELS -------------
export async function createPermission(data) {
    try {
        const createPermission = await prisma.Permission.create({ data: data })
        return { status: "success", data: createPermission, message: "Permission creado con exito!" };
    } catch (error) {
        console.log(error)
        throw error; // Re-lanza la excepción para que sea manejada en el controlador
    }
}

export async function getPermission(id) {
    try {
        let whereClause = { status: 1 };
        let message = "";
        if (id !== undefined) {
            whereClause.id = Number(id);
            message = "Permission encontrado con éxito";
        }
        const findPermission = await prisma.Permission.findMany({
            where: whereClause,
        });
        if (findPermission.length > 0) {
            return { status: "success", data: findPermission, message };
        } else {
            return { status: "error", data: [], message: "Permission no encontrado" };
        }
    } catch (error) {
        console.log(error)
        throw error; // Re-lanza la excepción para que sea manejada en el controlador
    }
}

export async function updatePermission(id, data) {
    try {
        if (id === undefined || data === undefined) {
            return { status: "error", data: [], message: "Faltan datos!" };
        }
        const updatePermission = await prisma.Permission.update({
            where: {
                id: Number(id),
                status: 1,
            },
            data: data
        });
        if (!updatePermission) {
            return { status: "error", data: [], message: "Ocurrió un error al modificar!" };
        }

        return { status: "success", data: updatePermission, message: "Permission modificado con exito!" };

    } catch (error) {
        console.log(error)
        throw error; // Re-lanza la excepción para que sea manejada en el controlador
    }
}

export async function deletePermission(id) {
    try {
        if (id === undefined) {
            return { status: "error", data: [], message: "Faltan datos!" };
        }
        const deletePermission = await prisma.Permission.update({
            where: {
                id: id
            },
            data: {
                status: 0
            }
        });

        if (!deletePermission) {
            return { status: "error", data: [], message: "Ocurrió un error al modificar!" };
        }
        return { status: "success", data: deletePermission, message: "Usuario modificado con exito!" };

    } catch (error) {
        console.log(error)
        throw error; // Re-lanza la excepción para que sea manejada en el controlador
    }
}