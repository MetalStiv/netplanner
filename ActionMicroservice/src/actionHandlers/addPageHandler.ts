import { ObjectId } from "mongodb";
import { ActionType } from "../actionType";
import { ActionHandler } from "./actionHandlers";
import titleUniqueization from "../helpers/titleUniqueization";

export const addPageHandler: ActionHandler = async (collections, message) => {
    if (message.type !== ActionType.ADD_PAGE) {
        return Promise.reject('Wrong handler');
    }

    function uniqPageTitle(name: string) {
        return titleUniqueization(name.length ? name : 'Page', collections.pageCollection);
    }

    const uniqTitle = await uniqPageTitle(message.data.newPage.name);

    const newPage = {
        _id: new ObjectId(),
        name: uniqTitle,
        projectId: new ObjectId(message.projectId)
    };

    const messageCopy = JSON.parse(JSON.stringify(message));
    messageCopy.data.newPage.id = newPage._id.toString();
    messageCopy.data.newPage.name = newPage.name;

    let newLayers = [];
    let newShapes = [];

    if (messageCopy.data.newPage.layers && messageCopy.data.newPage.layers.length) {
        newLayers.push(messageCopy.data.newPage.layers.map(layer => {
            const layerObjId = new ObjectId();
            layer.id = layerObjId.toString();
            newShapes.push(
                layer.shapes.map(shape => {
                    const shapeObjId = new ObjectId();
                    shape.id = shapeObjId.toString();
                    return {
                        _id: shapeObjId,
                        type: shape.type,
                        layerId: layerObjId,
                        zIndex: shape.zIndex,
                        graphicalProperties: shape.graphicalProperties
                    }
                })
            )
            return {
                _id: layerObjId,
                name: layer.name,
                pageId: new ObjectId(messageCopy.data.newPage.id),
                zIndex: layer.zIndex
            }
        })
        )
    }
    else {
        const objId = new ObjectId();
        newLayers = [{
            _id: objId,
            name: 'Layer',
            pageId: new ObjectId(messageCopy.data.newPage.id),
            zIndex: 1
        }];
        messageCopy.data.newPage.layers = [{
            name: newLayers[0].name,
            id: objId.toString(),
            zIndex: newLayers[0].zIndex,
            shapes: []
        }];
    }

    collections.pageCollection.insertOne(newPage);
    collections.layerCollection.insertMany(newLayers);
    newShapes.length && collections.shapeCollection.insertMany(newShapes);

    return messageCopy;
}