import { ObjectId } from "mongodb";
import { ActionType } from "../actionType";
import { ILayer } from "../model/ILayer";
import { IPage } from "../model/IPage";
import { ActionHandler } from "./actionHandlers";

export const deletePageHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.DELETE_PAGE) {
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
        
    const pages: IPage[] =  await collections.pageCollection
        .find({projectId: new ObjectId(message.projectId)}).toArray();
    if (!pages.filter(p => p._id.toString() !== message.pageId!)[0]){
        message.pageId = ""
        return message;
    }

    await collections.pageCollection.deleteOne(
        {
            _id: new ObjectId(message.pageId)
        },
    );

    const layers: ILayer[] =  await collections.layerCollection
        .find({pageId: new ObjectId(message.pageId)}).toArray();
    layers.forEach(async l => await collections.shapeCollection.deleteMany(
            {
                layerId: l._id
            }
        )
    );

    await collections.layerCollection.deleteMany(
        {
            page: new ObjectId(message.pageId)
        }
    )

    return message;
}