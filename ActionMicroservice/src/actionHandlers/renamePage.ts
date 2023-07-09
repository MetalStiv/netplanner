import { ObjectId } from "mongodb";
import { ActionType } from "../actionType";
import { ILayer } from "../model/ILayer";
import { ActionHandler } from "./actionHandlers";

export const renamePageHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.RENAME_PAGE) {
        return Promise.reject('Wrong handler');
    }

    await collections.pageCollection.findOneAndUpdate(
        {
            _id: new ObjectId(message.pageId)
        },
        {
            $set: { name: message.data.name }
        }
    )

    return message;
}