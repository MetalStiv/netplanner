import { ObjectId } from "mongodb";
import { ActionType } from "../actionType";
import { ActionHandler } from "./actionHandlers";

export const renameLayerHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.RENAME_LAYER) {
        return Promise.reject('Wrong handler');
    }

    await collections.layerCollection.findOneAndUpdate(
        {
            _id: new ObjectId(message.layerId)
        },
        {
            $set: { name: message.data.name }
        }
    )

    return message;
}