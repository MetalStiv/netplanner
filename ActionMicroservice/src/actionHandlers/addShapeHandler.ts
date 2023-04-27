import { ObjectId } from "mongodb";
import { ActionType } from "../actionType";
import { IShape } from "../model/IShape";
import { ActionHandler } from "./actionHandlers";

export const addShapeHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.ADD_SHAPE){
        return false;
    };
    console.log(message)
    const newShape: IShape = {
        _id: new ObjectId(),
        type: message.data.newShape.type,
        layerId: new ObjectId(message.layerId),
        zIndex: parseInt(message.data.zIndex),
        graphicalProperties: message.data.newShape.graphicalProperties
    };

    collections.shapeCollection.insertOne(newShape)
        
    message.data.newShape.id = newShape._id.toString();
    return true;
}