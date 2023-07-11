import { ObjectId } from "mongodb";
import { ActionType } from "../actionType";
import { ActionHandler } from "./actionHandlers";

export const deleteLayerHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.DELETE_LAYER) {
        return Promise.reject('Wrong handler');
    };

    await collections.layerCollection.deleteOne(
        {
            _id: new ObjectId(message.layerId)
        },
    );

    await collections.shapeCollection.deleteMany(
        {
            layerId: new ObjectId(message.layerId)
        }
    )

    return message;
}