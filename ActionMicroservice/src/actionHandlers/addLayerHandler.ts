import { Collection, ObjectId } from "mongodb";
import { ActionType } from "../actionType";
import { ILayer } from "../model/ILayer";
import { ActionHandler } from "./actionHandlers";
import { IShape } from "../model/IShape";
import { titleUniqueization } from "../helpers/titleUniqueization";

export const addLayerHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.ADD_LAYER) {
        return Promise.reject('Wrong handler');
    }
    if (message.senderRights !== 0){
        return Promise.reject('Not enough rigths');
    }

    collections.projectMetaCollection.findOneAndUpdate({
        _id: new ObjectId(message.projectId)
    },
        {
            $set: { lastModifyTime: new Date }
        });

    function uniqLayerTitle(name: string) {
        return titleUniqueization({title: name.length ? name : message.data.defaultName, collection: collections.layerCollection,
            parentField: 'pageId', parentId: message.pageId});
    }

    async function getZIndex(pageId: string) {
        const count = await collections.layerCollection.countDocuments({ pageId: new ObjectId(pageId) });
        return count * 1000;
    }

    const uniqTitle = await uniqLayerTitle(message.data.newLayer.name);
    const zIndex = await getZIndex(message.pageId);
    const newLayer: ILayer = {
        _id: message.data.newLayer.id ? new ObjectId(message.data.newLayer.id) : new ObjectId(),
        name: message.data.newLayer.name || uniqTitle,
        pageId: new ObjectId(message.pageId),
        zIndex: message.data.newLayer.zIndex || zIndex,
        isVisible: message.data.newLayer.isVisible === undefined ? true
            : message.data.newLayer.isVisible
    };

    await collections.layerCollection.insertOne(newLayer);

    if (message.data.newLayer.shapes){
        for await (const s of message.data.newLayer.shapes)
        {
            const newShape: IShape = {
                _id: new ObjectId(s.id),
                type: s.type,
                layerId: new ObjectId(message.data.newLayer.id),
                zIndex: s.zIndex,
                graphicalProperties: s.graphicalProperties
            };
        
            await collections.shapeCollection.insertOne(newShape)
        }
    }

    const messageCopy = JSON.parse(JSON.stringify(message));

    messageCopy.data.newLayer.id = newLayer._id.toString();
    messageCopy.data.newLayer.name = newLayer.name;
    messageCopy.data.newLayer.zIndex = newLayer.zIndex;

    return messageCopy;
}