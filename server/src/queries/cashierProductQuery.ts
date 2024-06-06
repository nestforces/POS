import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getCashierProductQuery = async (page : number) => {
	try {
		const pageSize = 3
		const skip = ( page - 1 ) * pageSize;
		const take = pageSize
		const result = await prisma.products.findMany({
			skip,
			take
		});
		return result;
	} catch (err) {
		throw err;
	}
};

export { getCashierProductQuery };
