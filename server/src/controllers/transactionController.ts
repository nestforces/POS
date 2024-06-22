import { Request, Response } from "express";
import { createTransactionsService, getTransactionService } from "../services/transactionService";

const createTransactionController = async (
	req: Request,
	res: Response
) => {
	try {
		const { total_quantity, total_price, cashier_id, cart } = req.body;
		const result = await createTransactionsService(
      total_quantity,
			total_price,
			cashier_id,
      cart,
		);
    console.log(total_quantity, total_price, cashier_id, cart);
    

		res.status(200).json({
			message: "Transaction Success",
			data: result,
		});
	} catch (err: any) {
    console.log(err);
    
		res.status(500).send(err.message);
	}
};

const getTransactionController = async (req: Request, res: Response) => {
    try{
        const result = await getTransactionService();
        return res.status(200).json({
            message: "Success",
            data: result,
          });
    } catch (err: any){
        return res.status(500).send(err.message)
    }
}


export { createTransactionController, getTransactionController };
