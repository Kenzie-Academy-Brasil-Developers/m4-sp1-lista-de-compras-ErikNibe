import express, { Application, json } from "express";
import { createPurchaseList, deletePurchaseList, deletePurchaseListItem, updatePurchaseListItem, viewAllPurchaseLists, viewPurchaseListById } from "./logic";
import { verifyPurchaseListExist, verifyPurchaseListItemExist, verifyPurchaseListItemKeysValues } from "./middlewares";

const app: Application = express();
app.use(json());

app.post("/purchaseList", createPurchaseList);
app.get("/purchaseList", viewAllPurchaseLists);
app.get("/purchaseList/:purchaseListId", verifyPurchaseListExist, viewPurchaseListById);
app.delete("/purchaseList/:purchaseListId", verifyPurchaseListExist, deletePurchaseList);
app.delete("/purchaseList/:purchaseListId/:itemName", verifyPurchaseListExist, verifyPurchaseListItemExist, deletePurchaseListItem);
app.patch("/purchaseList/:purchaseListId/:itemName", verifyPurchaseListExist, verifyPurchaseListItemExist, verifyPurchaseListItemKeysValues, updatePurchaseListItem);

app.listen(3000, () => {
    console.log("Server is runnig!");
})