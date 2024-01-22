import { ActionType } from "../actionType";
import { IShapeTree } from "./IShapeTree";
import { IGraphicalProperty, IShapeGraphicalProperties, IShapeObjectProperties } from "./IGraphicalProperty";
import { ILayerTree } from "./ILayerTree";
import { IPageTree } from "./IPageTree";
import { IConnectionPointTree } from "./IConnectionPointTree";

export interface IMessage {
    type: ActionType,
    senderId?: string,
    senderRights?: number,
    projectId?: string,
    pageId?: string,
    layerId?: string,
    shapeId?: string,
    data: {
        shapesIds?: string[],
        layersIds?: string[],
        pages?: IPageTree[],
        newShape?: IShapeTree,
        newLayer?: ILayerTree,
        isVisible?: boolean,
        newPage?: IPageTree,
        name?: string,
        graphicalProperties?: IShapeGraphicalProperties,
        objectProperties?: IShapeObjectProperties,
        connectionPoints?: IConnectionPointTree[][],
        // secondShapeConnectionPoints?: IConnectionPoint[],
        defaultName?: string,
    }
}