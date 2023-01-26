interface iItem {
    name: string;
    quantity: string;
};

interface iPurchaseList {
    id: number;
    listName: string;
    data: iItem[];
};

type tPurchaseList = Omit<iPurchaseList, "id">;

type tPurchaseListRequiredKeys = "id" | "listName" | "data";
type tItemRequiredKeys = "name" | "quantity";

export { iItem, iPurchaseList, tItemRequiredKeys, tPurchaseListRequiredKeys, tPurchaseList }