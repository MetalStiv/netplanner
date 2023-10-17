import { ObjectId } from "mongodb";
import { ActionType } from "../actionType";
import { IShape } from "../model/IShape";
import { ActionHandler } from "./actionHandlers";

export const addShapeHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.ADD_SHAPE) {
        return Promise.reject('Wrong handler');
    };
    if (message.senderRights !== 0){
        return Promise.reject('Not enough rigths');
    }

    collections.projectMetaCollection.findOneAndUpdate({
        _id: new ObjectId(message.projectId)
    },
        {
            $set: { lastModifyTime: new Date }
        });
        
    const newShape: IShape = {
        _id: new ObjectId(),
        type: message.data.newShape.type,
        layerId: new ObjectId(message.layerId),
        zIndex: message.data.newShape.zIndex,
        graphicalProperties: message.data.newShape.graphicalProperties,
        objectProperties: message.data.newShape.objectProperties,
    };

    await collections.shapeCollection.insertOne(newShape)

    message.data.newShape.id = newShape._id.toString();
    return message;
}