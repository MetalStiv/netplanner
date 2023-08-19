import { ObjectId } from "mongodb";
import { ActionType } from "../actionType";
import { ActionHandler } from "./actionHandlers";

export const changeGraphicalPropertiesHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.CHANGE_GRAPHICAL_PROPERTY) {
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
        
    await collections.shapeCollection.findOneAndUpdate(
        {
            layerId: new ObjectId(message.layerId),
            _id: new ObjectId(message.shapeId)
        },
        {
            $set: { graphicalProperties: message.data.graphicalProperties }
        }
    )

    return message;
}