import { getCashierProductQuery } from "../queries/cashierProductQuery";

const getCashierProductService = async (page : number) => {
	try {
		const res = await getCashierProductQuery(page || 1);
		return res;
	} catch (err) {
		throw err;
	}
};

export { getCashierProductService };
