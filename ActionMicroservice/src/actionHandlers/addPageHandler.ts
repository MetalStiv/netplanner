import { ObjectId } from "mongodb";
import { ActionType } from "../actionType";
import { ActionHandler } from "./actionHandlers";
import { IPage } from "../model/IPage";
import { ILayer } from "../model/ILayer";

export const addPageHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.ADD_PAGE) {
        return false;
    }

    const newPage: IPage = {
        _id: new ObjectId(),
        name: message.data.newPage.name,
        projectId: new ObjectId(message.projectId)
    };

    message.data.newPage.id = newPage._id.toString();

    const newLayers = [];
    message.data.newPage.layers.forEach(layer => {
        newLayers.push({
            _id: new ObjectId(),
            name: layer.name,
            pageId: new ObjectId(message.data.newPage.id),
            zIndex: layer.zIndex
        })
        layer.id = newLayers.at(-1)._id.toString();
    })

    collections.pageCollection.insertOne(newPage);
    collections.layerCollection.insertMany(newLayers);

    return true;
}