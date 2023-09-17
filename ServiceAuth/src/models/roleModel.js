import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//------------- FUNCTIONS -------------


//------------- FUNCTION MODELS -------------
export async function createRole(data) {
    try {
        const createRole = await prisma.Role.create({ data: data })
        return { status: "success", data: createRole, message: "Role creado con exito!" };
    } catch (error) {
        console.log(error)
        throw error; // Re-lanza la excepción para que sea manejada en el controlador
    }
}

export async function getRole(id, page, limit) {
    try {
        let whereClause = { status: 1 };
        let message = "";

        //paginado
        const totalRole = await prisma.Role.count({
            where: {
                status: 1
            }
        })
        let idOEmail = false;
        let paginas = totalRole / limit;
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
            message = "Role encontrado con éxito";
            skip = 0
            take = 1
            idOEmail = true
        }
        const findRole = await prisma.Role.findMany({
            skip: skip,
            take: take, 
            where: whereClause,
        });
        if (findRole.length > 0) {
            if (!idOEmail) {
                findRole.unshift({ pagination: paginas })
            }
            return { status: "success", data: findRole, message };
        } else {
            return { status: "error", data: [], message: "Role no encontrado" };
        }
    } catch (error) {
        console.log(error)
        throw error; // Re-lanza la excepción para que sea manejada en el controlador
    }
}

export async function updateRole(id, data) {
    try {
        if (id === undefined || data === undefined) {
            return { status: "error", data: [], message: "Faltan datos!" };
        }
        const updateRole = await prisma.Role.update({
            where: {
                id: Number(id),
                status: 1,
            },
            data: data
        });
        if (!updateRole) {
            return { status: "error", data: [], message: "Ocurrió un error al modificar!" };
        }

        return { status: "success", data: updateRole, message: "Usuario modificado con exito!" };

    } catch (error) {
        console.log(error)
        throw error; // Re-lanza la excepción para que sea manejada en el controlador
    }
}

export async function deleteRole(id) {
    try {
        if (id === undefined) {
            return { status: "error", data: [], message: "Faltan datos!" };
        }
        const deleteRole = await prisma.Role.update({
            where: {
                id: id
            },
            data: {
                status: 0
            }
        });

        if (!deleteRole) {
            return { status: "error", data: [], message: "Ocurrió un error al modificar!" };
        }
        return { status: "success", data: deleteRole, message: "Usuario modificado con exito!" };

    } catch (error) {
        console.log(error)
        throw error; // Re-lanza la excepción para que sea manejada en el controlador
    }
}