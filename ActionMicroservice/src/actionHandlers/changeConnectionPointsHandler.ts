import { ObjectId } from "mongodb";
import { ActionType } from "../actionType";
import { ActionHandler } from "./actionHandlers";

export const changeConnectionPointsHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.CHANGE_CONNECTION_POINTS) {
        return Promise.reject('Wrong handler');
    };
    if (message.senderRights !== 0) {
        return Promise.reject('Not enough rights');
    };

    collections.projectMetaCollection.findOneAndUpdate({
        _id: new ObjectId(message.projectId)
    },
        {
            $set: { lastModifyTime: new Date }
        });

    message.data.shapesIds.forEach(async (shapeId, i) => {
        await collections.shapeCollection.findOneAndUpdate(
            {
                _id: new ObjectId(shapeId)
            },
            {
                $set: { connectionPoints: message.data.connectionPoints[i].map(({ id, ...p }) => ({ ...p, _id: new ObjectId(id) })) }
            }
        );
    });

    return message;
}