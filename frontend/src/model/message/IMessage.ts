import { IMessageProperty, IMessageConnectionPoint, IMessageShape } from "./IMessageShape"
import { IMessageLayer } from "./IMessageLayer"
import { IMessagePage } from "./IMessagePage"
import ICoords from "../../common/model/ICoords"

export interface IMessage {
    type: string,
    uid?: string,
    projectId?: string,
    pageId?: string,
    layerId?: string,
    shapeId?: string,
    senderId?: string,
    // shapesGroup?: {
    //     shape: string,
    //     layer: string
    // }[],
    data?: {
        shapesIds?: string[],
        layersIds?: string[],
        pages?: IMessagePage[],
        newShape?: IMessageShape,
        newLayer?: IMessageLayer,
        isVisible?: boolean,
        newPage?: IMessagePage,
        graphicalProperties?: IMessageProperty[],
        objectProperties?: IMessageProperty[],
        connectionPoints?: IMessageConnectionPoint[][],
        // secondShapeConnectionPoints?: IConnectionPoint[],
        coords?: ICoords,
        name?: string,
        defaultName?: string,
    }
}