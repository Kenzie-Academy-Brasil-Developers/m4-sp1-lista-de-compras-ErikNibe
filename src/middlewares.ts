import { Request, Response, NextFunction, request } from "express";
import { purchaseLists } from "./database";
import { tItemRequiredKeys } from "./interfaces";

const verifyPurchaseListExist = (request: Request, response: Response, next: NextFunction): Response | void => {

    const id: number = Number(request.params.purchaseListId);

    const indexPurchaseList: number = purchaseLists.findIndex((purchaseList) => purchaseList.id == id);

    if (indexPurchaseList === -1) {
        return response.status(404).json({
            message: "Purchase list not found!"
        })
    };

    request.purchaseListInfo = {
        indexPurchaseList: indexPurchaseList
    };

    return next();
}

const verifyPurchaseListItemExist = (request: Request, response: Response, next: NextFunction): Response | void => { 
    const id: number = Number(request.params.purchaseListId);
    const itemName: string = request.params.itemName;

    const indexPurchaseList: number = purchaseLists.findIndex((purchaseList) => purchaseList.id === id);

    const indexItem: number = purchaseLists[indexPurchaseList].data.findIndex((item) => item.name === itemName);

    if (indexItem === -1) {
        return response.status(404).json({
            message: "Item not found!"
        })
    };

    request.purchaseListInfo = {
        indexPurchaseList: indexPurchaseList,
        indexItem: indexItem
    };

    return next();
}

const verifyPurchaseListItemKeysValues = (request: Request, response: Response, next: NextFunction): Response | void => {

    const requiredItemKeys: tItemRequiredKeys[] = ["name", "quantity"]; 

    const payloadKeys: string[] = Object.keys(request.body);

    const hasOnlyRequiredKeys: boolean = requiredItemKeys.every((key: string) => {
        return payloadKeys.includes(key);
    })

    if (!hasOnlyRequiredKeys || payloadKeys.length > requiredItemKeys.length) {
        return response.status(400).json({
            message: `Items must contain only: ${requiredItemKeys}`
        })
    }

    const payloadValues = Object.values(request.body);

    if(typeof payloadValues[0] !== "string" && typeof payloadValues[1] !== "string") {
        return response.status(400).json({
            message: "Items keys must be a string"
        })
    }

    return next();
}

export { verifyPurchaseListExist, verifyPurchaseListItemExist, verifyPurchaseListItemKeysValues }