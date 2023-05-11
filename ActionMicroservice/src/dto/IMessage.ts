import { ActionType } from "../actionType";
import { IShapeTree } from "./IShapeTree";
import { IGraphicalProperty, IShapeGraphicalProperties } from "./IGraphicalProperty";
import { ILayerTree } from "./ILayerTree";
import { IPageTree } from "./IPageTree";

export interface IMessage {
    type: ActionType,
    senderId?: string,
    projectId?: string,
    pageId?: string,
    layerId?: string,
    shapeId?: string,
    data: {
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
        newLayer?: ILayerTree,
        newPage?: IPageTree,
        graphicalProperties?: IShapeGraphicalProperties
    }
}