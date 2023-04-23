import { ActionType } from "../actionType";
import { ActionHandler } from "./actionHandlers";

export const addPageHandler: ActionHandler = async (collection, message) => {
    if (message.type !== ActionType.ADD_PAGE){
        return false;
    } 
    return true;
}