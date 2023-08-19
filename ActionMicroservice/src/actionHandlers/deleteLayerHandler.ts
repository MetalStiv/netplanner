import { ObjectId } from "mongodb";
import { ActionType } from "../actionType";
import { ILayer } from "../model/ILayer";
import { ActionHandler } from "./actionHandlers";

export const deleteLayerHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.DELETE_LAYER) {
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

    const layer = await collections.layerCollection.findOne({_id: new ObjectId(message.layerId)})
    const layers: ILayer[] =  await collections.layerCollection
        .find({pageId: new ObjectId(layer.pageId)}).toArray();
    if (!layers.filter(l => l._id.toString() !== message.layerId!)[0]){
        message.layerId = ""
        return message;
    }

    await collections.layerCollection.deleteOne(
        {
            _id: new ObjectId(message.layerId)
        },
    );
    console.log(1)
    await collections.shapeCollection.deleteMany(
        {
            layerId: new ObjectId(message.layerId)
        }
    )
    console.log(2)

    return message;
}