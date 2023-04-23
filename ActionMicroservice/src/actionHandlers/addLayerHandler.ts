import { ActionType } from "../actionType";
import { ActionHandler } from "./actionHandlers";

export const addLayerHandler: ActionHandler = async (collection, message) => {
    if (message.type !== ActionType.ADD_LAYER){
        return false;
    } 
    return true;
}