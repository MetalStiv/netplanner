import { Collection, ObjectId } from "mongodb";
import { ActionType } from "../actionType";
import { ILayer } from "../model/ILayer";
import { ActionHandler } from "./actionHandlers";

export const changeLayerVisibleHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.CHANGE_LAYER_VISIBLE) {
        return Promise.reject('Wrong handler');
    }

    collections.layerCollection.findOneAndUpdate(
        {
            _id: new ObjectId(message.layerId)
        },
        {
            $set: { isVisible: message.data.isVisible }
        }
    )

    return message;
}