import {
	createtransactionsQuery,
	updateProductQuantityQuery,
	createTransactionItemsQuery,
	getTransactionQuery,
} from "../queries/transactionQuery";

const createTransactionsService = async (
	total_quantity: number,
	total_price: number,
	cashier_id: number,
	cart: any
) => {
	try {
		const res = await createtransactionsQuery(
			total_quantity,
			total_price,
			cashier_id
		);
		for (let i = 0; i < cart.length; i++) {
			await createTransactionItemsQuery(
				cart[i].total,
				cart[i].id,
				res.id
			);
			await updateProductQuantityQuery(cart[i].id, cart[i].quantity);
		}
		return res;
	} catch (err) {
		throw err;
	}
};

const getTransactionService = async () => {
    try{
        const cashier = await getTransactionQuery();
        return cashier;
    } catch (err){
        throw err;
    }
};

export { createTransactionsService, getTransactionService };
