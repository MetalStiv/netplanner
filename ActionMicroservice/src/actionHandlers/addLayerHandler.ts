import { ObjectId } from "mongodb";
import { ActionType } from "../actionType";
import { ILayer } from "../model/ILayer";
import { ActionHandler } from "./actionHandlers";

export const addLayerHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.ADD_LAYER) {
        return false;
    }
    const newLayer: ILayer = {
        _id: new ObjectId(),
        name: message.data.newLayer.name,
        pageId: new ObjectId(message.pageId),
        zIndex: message.data.newLayer.zIndex
    };

    collections.layerCollection.insertOne(newLayer);

    message.data.newLayer.id = newLayer._id.toString();
    return true;
}