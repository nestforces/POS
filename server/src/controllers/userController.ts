import {Request, Response} from "express";
import {  findCashierService, updateCashierService, deleteCashierService } from "../services/userServices";


const findCashierController = async (req: Request, res: Response) => {
    try{
        const result = await findCashierService();
        return res.status(200).json({
            message: "Success",
            data: result,
          });
    } catch (err: any){
        return res.status(500).send(err.message)
    }
}

const updateCashierController = async (req: Request, res: Response) => {
    try{
        const {id} = req.params
        const {email, username, status, type} = req.body
        await updateCashierService(Number(id), String(email), String(username), String(status), String(type))
        return res.status(200).json({
            message: "Success",
        });
    } catch (err: any){
        return res.status(500).send(err.message)
    }
}
const deleteCashierController = async (req: Request, res: Response) => {
    try{
        const {id} = req.params
        const {email, username, status, type} = req.body
        await deleteCashierService(Number(id))
        return res.status(200).json({
            message: "Success",
        });
    } catch (err: any){
        return res.status(500).send(err.message)
    }
}


export {findCashierController, updateCashierController, deleteCashierController}