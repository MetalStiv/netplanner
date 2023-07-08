import { ObjectId } from "mongodb";
import { ActionType } from "../actionType";
import { IShape } from "../model/IShape";
import { ActionHandler } from "./actionHandlers";

export const addShapeHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.ADD_SHAPE) {
        return Promise.reject('Wrong handler');
    };
    const newShape: IShape = {
        _id: new ObjectId(),
        type: message.data.newShape.type,
        layerId: new ObjectId(message.layerId),
        zIndex: message.data.newShape.zIndex,
        graphicalProperties: message.data.newShape.graphicalProperties
    };

    await collections.shapeCollection.insertOne(newShape)

    message.data.newShape.id = newShape._id.toString();
    return message;
}