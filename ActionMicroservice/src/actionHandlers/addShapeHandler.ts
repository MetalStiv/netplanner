import { ObjectId } from "mongodb";
import { ActionTypes } from "../actionTypes";
import { IProject } from "../model/IProject";
import { IShape } from "../model/IShape";
import { ActionHandler } from "./actionHandlers";

export const addShapeHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionTypes.ADD_SHAPE){
        return false;
    };
    const newShape: IShape = {
        _id: new ObjectId(),
        type: message.data.shape,
        layerId: new ObjectId(message.layerId),
        graphicalProperties: {
            x: message.data.dropCoords.x.toString(),
            y: message.data.dropCoords.y.toString()
        }
    };

    collections.shapeCollection.insertOne(newShape)
    // collections.layerCollection.updateOne(
    //     { _id: new ObjectId(message.layerId) },
    //     { $push: { shapes: newShape._id } }
    // )
        
    message.data.id = newShape._id.toString();
    return true;
}