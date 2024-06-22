import {Prisma, PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const findUserQuery = async ({ email = null, username = null } : { email?: string | null, username?: string | null }) => {
    try {
      const user = await prisma.users.findFirst({
        where: {
          OR: [
            { email },
            { username },
          ],
        },
      });
  
      return user;
    } catch (err) {
      throw err;
    }
};

const findCashierQuery = async () => {
  try{ 
    const cashier = await prisma.users.findMany({
      where: {
        status: "active"
      }}
    );

    return cashier;
  } catch (err){
    throw err;
  }
};

const updateCashierQuery = async (id: number, email: string, username: string, status: string, type: string) => {
  try{
      await prisma.users.update({
          where:{ id: id },
          data: {email, username, status, type}
      });
  } catch (err){
      throw err;
  }
};
const deleteCashierQuery = async (id: number) => {
  try{
      await prisma.users.delete({
          where:{ id: id },
      });
  } catch (err){
      throw err;
  }
};

const updateAvatarQuery = async (id: number, avatar: string) => {
  try{
      await prisma.users.update({
          where:{ id: id },
          data: {avatar}
      });
  } catch (err){
      throw err;
  }
};

export {findUserQuery, findCashierQuery, updateCashierQuery, deleteCashierQuery, updateAvatarQuery};