import { ActionType } from "../actionType";
import { IShapeTree } from "./IShapeTree";
import { IGraphicalProperty, IShapeGraphicalProperties } from "./IGraphicalProperty";

export interface IMessage {
    type: ActionType,
    senderId?: string,
    projectId?: string,
    pageId?: string,
    layerId?: string,
    shapeId?: string,
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
        newShape?: IShapeTree,
        graphicalProperties?: IShapeGraphicalProperties
    }
}