import express, { Router } from "express";
import health from "./health";
import packagerouter from "./Packages/package.routes";
import userRouter from "./Users/Users.routes";
import kycrouter from "./KYC/Kyc.routes";
import planPurchaseRouter from "./PlanPurchase/PlanPurchase.routes";
import systemIncomeRouter from "./systemincome/systemincome.route";
import walletRouter from "./wallet/wallet.routes";
import setupRouter from "./setup/setup.routes";
import orderRouter from "./Order/order.routes";
import productRouter from "./Product/product.routes";
import cartRouter from "./Cart/cart.routes";
import addressRouter from "./Address/address.routes";
import payoutRouter from "./Payout/payout.routes";
import configRouter from "./Config/config.routes";

const v1: Router = express.Router();

v1.use("/health", health);

v1.use("/package", packagerouter);

v1.use("/users", userRouter);

v1.use("/kyc", kycrouter);

v1.use("/planpurchase", planPurchaseRouter);

v1.use("/systemincome", systemIncomeRouter);

v1.use("/wallet", walletRouter);

v1.use("/setup", setupRouter);

v1.use("/order", orderRouter);

v1.use("/products", productRouter);

v1.use("/cart", cartRouter);

v1.use("/address", addressRouter);

v1.use("/payout", payoutRouter);
v1.use("/config", configRouter);


export default v1;
