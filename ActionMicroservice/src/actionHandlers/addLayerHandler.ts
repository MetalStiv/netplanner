import { ActionHandler } from "./actionHandlers";

export const addLayerHandler: ActionHandler = async (collection, message) => {
    if (message.type !== "addPage"){
        return false;
    } 
    return true;
}