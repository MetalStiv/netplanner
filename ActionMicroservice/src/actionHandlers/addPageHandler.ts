import { ActionHandler } from "./actionHandlers";

export const addPageHandler: ActionHandler = async (collection, message) => {
    if (message.type !== "addPage"){
        return false;
    } 
    return true;
}