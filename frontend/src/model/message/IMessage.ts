import { IMessageProperty, IMessageShape } from "./IMessageShape"
import { IMessageLayer } from "./IMessageLayer"
import { IMessagePage } from "./IMessagePage"

export interface IMessage {
    type: string,
    uid?: string,
    projectId?: string,
    pageId?: string,
    layerId?: string,
    shapeId?: string,
    senderId?: string,
    data?: {
        pages?: IMessagePage[],
        newShape?: IMessageShape,
        newLayer?: IMessageLayer,
        isVisible?: boolean,
        newPage?: IMessagePage,
        graphicalProperties?: IMessageProperty[],
        objectProperties?: IMessageProperty[],
        coords?: {x: number, y: number},
        name?: string,
        defaultName?: string,
    }
}