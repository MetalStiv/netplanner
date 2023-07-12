import { ObjectId } from "mongodb";
import { ActionType } from "../actionType";
import { ActionHandler } from "./actionHandlers";

export const renamePageHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.RENAME_PAGE) {
        return Promise.reject('Wrong handler');
    }

    collections.projectMetaCollection.findOneAndUpdate({
        _id: new ObjectId(message.projectId)
    },
        {
            $set: { lastModifyTime: new Date }
        });

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