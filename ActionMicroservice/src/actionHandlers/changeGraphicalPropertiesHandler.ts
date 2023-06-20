import { ObjectId } from "mongodb";
import { ActionType } from "../actionType";
import { ActionHandler } from "./actionHandlers";

export const changeGraphicalPropertiesHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.CHANGE_GRAPHICAL_PROPERTY) {
        return Promise.reject('Wrong handler');
    };

    collections.shapeCollection.findOneAndUpdate(
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