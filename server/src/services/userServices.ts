import { findCashierQuery, updateCashierQuery, deleteCashierQuery } from "../queries/userQuery";

const findCashierService = async () => {
    try{
        const cashier = await findCashierQuery();
        return cashier;
    } catch (err){
        throw err;
    }
};

const updateCashierService = async (id: number, email: string, username: string, status: string, type: string) => {
    try{
        await updateCashierQuery(Number(id), String(email), String(username), String(status), String(type));
    } catch (err){
        throw err;
    }
}

const deleteCashierService = async (id: number) => {
    try{
        await deleteCashierQuery(Number(id));
    } catch (err){
        throw err;
    }
}





export {findCashierService, updateCashierService, deleteCashierService}