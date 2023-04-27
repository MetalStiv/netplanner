import { ActionType } from "../actionType";
import { IShapeTree } from "./IShapeTree";

export interface IMessage {
    type: ActionType,
    senderId?: string,
    projectId?: string,
    pageId?: string,
    layerId?: string,
    data: {
        zIndex?: string,
        pages?: {
            id: string,
            name: string,
            layers: {
                id: string,
                name: string,
                shapes: IShapeTree[]
            }[]
        }[],
        newShape?: IShapeTree
    }
}