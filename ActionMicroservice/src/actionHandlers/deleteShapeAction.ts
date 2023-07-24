import { ObjectId } from "mongodb";
import { ActionType } from "../actionType";
import { ActionHandler } from "./actionHandlers";

export const deleteShapeHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.DELETE_SHAPE) {
        return Promise.reject('Wrong handler');
    };
    if (message.senderRights !== 2){
        return Promise.reject('Not enough rigths');
    }

    collections.projectMetaCollection.findOneAndUpdate({
        _id: new ObjectId(message.projectId)
    },
        {
            $set: { lastModifyTime: new Date }
        });

    await collections.shapeCollection.deleteOne(
        {
            _id: new ObjectId(message.shapeId)
        },
    );

    return message;
}