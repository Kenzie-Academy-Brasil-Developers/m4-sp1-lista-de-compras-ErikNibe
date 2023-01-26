import { Request, Response } from "express";
import { purchaseLists } from "./database";
import { iItem, iPurchaseList, tItemRequiredKeys, tPurchaseList, tPurchaseListRequiredKeys } from "./interfaces";

const validateData = (payload: any): iPurchaseList => {
    //Verify if all keys are correct
    const payloadKeys: string[] = Object.keys(payload);
    const requiredKeys: tPurchaseListRequiredKeys[] = ["data", "id", "listName"];

    const hasRequiredKeys: boolean = requiredKeys.every((key: string) => {
        return payloadKeys.includes(key);
    });

    if (!hasRequiredKeys || payloadKeys.length > requiredKeys.length) {
        throw new Error(`Must only contain: ${requiredKeys}`);
    };

    //Verify if values types are correct

    const payloadValues: string[] = Object.values(payload);

    if (typeof payloadValues[1] !== "string" || typeof payloadValues[2] !== "object") {

        throw new Error("The id must be a number, the listName must be a string and the data must be a object");
    }
    
    //Verify if item keys are correct
    const itemList: iItem[] = payload.data;
    const requiredItemKeys: tItemRequiredKeys[] = ["name", "quantity"];

    const hasRequiredItemKeys: boolean[] | void[] = itemList.map((item) => {
        let itemKeys: string[] = Object.keys(item);
        
        return requiredItemKeys.every((key: string) => {
            return itemKeys.includes(key);
        })
    })

    const verifyItem = hasRequiredItemKeys.every((key: boolean) => key === true)
    
    if (!verifyItem) {
        throw new Error(`List must contain only: ${requiredItemKeys}`);
    }

    return payload;
}

const createPurchaseList = (request: Request, response: Response): Response => {
    
    try {
        const purchaseListData: tPurchaseList = request.body;
        const newPurchaseListData: iPurchaseList = {
            id: purchaseLists.length + 1,
            ...purchaseListData
        }

        const validatedData: iPurchaseList = validateData(newPurchaseListData);

        purchaseLists.push(newPurchaseListData);

        return response.status(201).json(validatedData);

    } catch (error: unknown) {
        
        if(error instanceof Error) {
            return response.status(400).json({
                message: error.message
            })
        };

        console.log(error);

        return response.status(500).json({
            message: error
        });
    };
};

const viewAllPurchaseLists = (request: Request, response: Response): Response => {

    return response.status(200).json(purchaseLists);
}

const viewPurchaseListById = (request: Request, response: Response): Response => {
    
    const indexPurchaseList: number = request.purchaseListInfo.indexPurchaseList;

    return response.status(200).json(purchaseLists[indexPurchaseList]);
}

const deletePurchaseList = (request: Request, response: Response): Response => {
    
    const indexPurchaseList: number = request.purchaseListInfo.indexPurchaseList;

    purchaseLists.splice(indexPurchaseList, 1);

    return response.status(204).send();
}

const deletePurchaseListItem = (request: Request, response: Response): Response => {

    const indexPurchaseList: number = request.purchaseListInfo.indexPurchaseList;
    const indexItem: number | undefined = request.purchaseListInfo.indexItem;

    if (indexItem) { 
        purchaseLists[indexPurchaseList].data.splice(indexItem, 1);
    }

    return response.status(204).send();
}

const updatePurchaseListItem = (request: Request, response: Response): Response => {

    const indexPurchaseList: number = request.purchaseListInfo.indexPurchaseList;
    const indexItem: number | undefined = request.purchaseListInfo.indexItem;
    
    if (typeof indexItem === "number") {
        purchaseLists[indexPurchaseList].data[indexItem] = { ...purchaseLists[indexPurchaseList].data[indexItem], ...request.body };

        return response.json(purchaseLists[indexPurchaseList].data[indexItem]);
    }

    return response;
}

export { createPurchaseList, viewAllPurchaseLists, viewPurchaseListById, deletePurchaseList, deletePurchaseListItem, updatePurchaseListItem }