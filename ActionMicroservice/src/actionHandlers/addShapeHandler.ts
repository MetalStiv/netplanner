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
        type: message.data.shape,
        layerId: new ObjectId(message.layerId),
        zIndex: parseInt(message.data.zIndex),
        graphicalProperties: {
            x: message.data.dropCoords.x.toString(),
            y: message.data.dropCoords.y.toString()
        }
    };

    collections.shapeCollection.insertOne(newShape)
        
    message.data.id = newShape._id.toString();
    return true;
}