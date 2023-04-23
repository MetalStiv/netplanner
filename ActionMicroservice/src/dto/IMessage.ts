import { ActionType } from "../actionType";
import { IPageTree } from "./IPageTree";

export interface IMessage {
    type: ActionType,
    senderId?: string,
    projectId?: string,
    pageId?: string,
    layerId?: string,
    data: {
        id?: string,
        shape?: string, 
        zIndex?: string,
        dropCoords?: { x: number, y: number },
        pages?: IPageTree[]
    },
}