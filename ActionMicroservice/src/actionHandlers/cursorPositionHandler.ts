import { ActionType } from "../actionType";
import { ActionHandler } from "./actionHandlers";

export const cursorPositionHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.CURSOR_POSITION) {
        return Promise.reject('Wrong handler');
    };

    return message;
}