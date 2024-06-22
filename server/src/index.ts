import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path"
import dotenv from 'dotenv';

dotenv.config({
    path: path.resolve(__dirname, '../.env'),
  });
  
  
const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(
    cors({
      origin: process.env.WHITELISTED_DOMAIN
        ? process.env.WHITELISTED_DOMAIN.split(" ")
        : undefined,
    })
  );

import productRouter from './routes/productRouter'
import reportRouter from './routes/reportRouter'

import authRouter from "../src/routes/authRouter"
import userRouter from "../src/routes/userRouter"
import transactionRouter from '../src/routes/transactionRouter'


app.use("/auth", authRouter)
app.use("/user", userRouter)

app.use('/products', productRouter)
app.use('/product', productRouter)
app.use('/report', reportRouter)
app.use('/transaction', transactionRouter)

app.use("/uploads", express.static(path.join(__dirname, "./public/images")));

app.listen(port, () => {
    console.log((`server started on port ${port}`));
    
})