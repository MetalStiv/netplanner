import { ObjectId } from "mongodb";
import { IDatadaseCollections } from "../app";
import { IMessage } from "../dto/IMessage";
import { IProjectMeta } from "../model/IProjectMeta";
import { addLayerHandler } from "./addLayerHandler";
import { addPageHandler } from "./addPageHandler";
import { addShapeHandler } from "./addShapeHandler";
import { changeGraphicalPropertiesHandler } from "./changeGraphicalPropertiesHandler";

export type ActionHandler = (collections: IDatadaseCollections, message: IMessage) => Promise<boolean>

export interface IActionHandlers {
    handlers: ActionHandler[],
    handle: (collections: IDatadaseCollections, message: IMessage) => Promise<boolean>
}

export const actionHandlers: IActionHandlers = {
    handlers: new Array(
        addShapeHandler,
        addLayerHandler,
        addPageHandler,
        changeGraphicalPropertiesHandler
    ),

    handle(collections: IDatadaseCollections, message: IMessage) {
        let result: boolean = false;
        this.handlers.every(async handler => {
            if (await handler(collections, message)) {
                result = true;
                return (false);
            }
            return true;
        })
        collections.projectMetaCollection.findOneAndUpdate({
            _id: new ObjectId(message.projectId)
        },
        {
            $set: { lastModifyTime: new Date }
        });
        return Promise.resolve(result);
    }
}

export default actionHandlers;