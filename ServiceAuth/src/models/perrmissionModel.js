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

export async function getPermission(id, page, limit) {
    try {
        let whereClause = { status: 1 };
        let message = "";

        //paginado
        const totalPermission = await prisma.Permission.count({
            where: {
                status: 1
            }
        })
        let idOEmail = false;
        let paginas = totalPermission / limit;
        let entero = Math.trunc(paginas)
        let calculo = paginas - entero
        if (calculo > 0) {
            entero = entero + 1;
            paginas = entero;
        }
        let skip = Number(page) * Number(limit)
        let take = Number(limit)
        //FIN - paginado

        if (id !== undefined) {
            whereClause.id = Number(id);
            message = "Permission encontrado con éxito";
            skip = 0
            take = 1
            idOEmail = true
        }



        const findPermission = await prisma.Permission.findMany({
            skip: skip,
            take: take,
            where: whereClause,
        });
        if (findPermission.length > 0) {
            if (!idOEmail) {
                findPermission.unshift({ pagination: paginas })
            }
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