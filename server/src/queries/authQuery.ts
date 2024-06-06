import {Prisma, PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const registerQuery = async (username: string, email: string, password: string, type: string) => {
    try{
        const result = await prisma.users.create({
        data: { 
            username,
            email,
            password,
            type,
            roleId: 2,
            status: "active"
           },
    })
        return result;
    } catch (err){
        throw err
    }
}

const loginQuery = async (email: string) => {
    try {
        const res = await prisma.users.findFirst({
            where: {
                email,
            }
        });

        return res
    } catch (err) {
        throw err;
    }
};

const keepLoginQuery = async (id:number) => {
    try{
        const res = await prisma.users.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                username: true,
                email: true,
                roleId: true,
            },
        });
        
        return res
    } catch(err){
        throw err;
    }
};

const forgotPasswordQuery = async (email: string, resetToken: string, resetTokenExpiry: Date) => {
    try {
        await prisma.users.update({ 
            where: { email },
            data: { resetToken, resetTokenExpiry } 
        });

        
    } catch (err) {
        throw err;
    }
};

const setPasswordQuery = async (email: string, password: string) => {
    try{
        await prisma.users.update({
            where:{ email: email },
            data: { password, resetToken: null, resetTokenExpiry: null }
        });
    } catch (err){
        throw err;
    }
}


export {registerQuery, loginQuery, keepLoginQuery, forgotPasswordQuery, setPasswordQuery}