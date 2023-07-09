import { ObjectId } from "mongodb";
import { IDatadaseCollections } from "../app";
import { IMessage } from "../dto/IMessage";
import { addLayerHandler } from "./addLayerHandler";
import { addPageHandler } from "./addPageHandler";
import { addShapeHandler } from "./addShapeHandler";
import { changeGraphicalPropertiesHandler } from "./changeGraphicalPropertiesHandler";
import { cursorPositionHandler } from "./cursorPositionHandler";
import { deleteShapeHandler } from "./deleteShapeAction";
import { changeLayerVisibleHandler } from "./changeLayerVisible";
import { renameLayerHandler } from "./renameLayer";
import { renamePageHandler } from "./renamePage";

export type ActionHandler = (collections: IDatadaseCollections, message: IMessage) => Promise<IMessage | Error>

export interface IActionHandlers {
    handlers: ActionHandler[],
    handle: (collections: IDatadaseCollections, message: IMessage) => Promise<IMessage>
}

export const actionHandlers: IActionHandlers = {
    handlers: new Array(
        cursorPositionHandler,
        addShapeHandler,
        deleteShapeHandler,
        addLayerHandler,
        renameLayerHandler,
        changeLayerVisibleHandler,
        addPageHandler,
        renamePageHandler,
        changeGraphicalPropertiesHandler
    ),

    handle(collections: IDatadaseCollections, message: IMessage) {
        collections.projectMetaCollection.findOneAndUpdate({
            _id: new ObjectId(message.projectId)
        },
            {
                $set: { lastModifyTime: new Date }
            });

        return Promise.allSettled(this.handlers.map(handler => handler(collections, message))).then(results => {
            const fulfilledResult = results.find(result => result.status === "fulfilled");
            return fulfilledResult.status === "fulfilled" ? fulfilledResult.value : {};
        });
    }
}

export default actionHandlers;