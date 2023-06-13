import { Collection, ObjectId } from "mongodb";
import { ActionType } from "../actionType";
import { ILayer } from "../model/ILayer";
import { ActionHandler } from "./actionHandlers";
import titleUniqueization from "../helpers/titleUniqueization";

export const addLayerHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.ADD_LAYER) {
        return Promise.reject('Wrong handler');
    }

    function uniqLayerTitle(name: string) {
        return titleUniqueization(name.length ? name : 'Layer', collections.layerCollection);
    }

    async function getZIndex(pageId: string) {
        const count = await collections.layerCollection.countDocuments({ pageId: new ObjectId(pageId) });
        return count * 1000;
    }

    const uniqTitle = await uniqLayerTitle(message.data.newLayer.name);
    const zIndex = await getZIndex(message.pageId);
    const newLayer: ILayer = {
        _id: new ObjectId(),
        name: uniqTitle,
        pageId: new ObjectId(message.pageId),
        zIndex: zIndex
    };

    collections.layerCollection.insertOne(newLayer);

    const messageCopy = JSON.parse(JSON.stringify(message));

    messageCopy.data.newLayer.id = newLayer._id.toString();
    messageCopy.data.newLayer.name = uniqTitle;
    messageCopy.data.newLayer.zIndex = zIndex;

    return messageCopy;
}