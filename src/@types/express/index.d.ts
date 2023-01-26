import * as express from "express";

declare global {
    namespace Express {
        interface Request {
            purchaseListInfo: {
                indexPurchaseList: number,
                indexItem?: number | undefined
            }
        }
    }
}