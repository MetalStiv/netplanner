import { IMessageShape } from "./IMessageShape"
import { IShapeGraphicalProps } from "../shapes/IShape"
import { IMessageLayer } from "./IMessageLayer"
import { IMessagePage } from "./IMessagePage"

export interface IMessage {
    type: string,
    projectId?: string,
    pageId?: string,
    layerId?: string,
    shapeId?: string,
    data: {
        pages?: [{
            id: string,
            name: string,
            layers: [{
                id: string,
                name: string,
                zIndex: number,
                isVisible: boolean,
                shapes: IMessageShape[]
            }]
        }],
        newShape?: IMessageShape,
        newLayer?: IMessageLayer,
        isVisible?: boolean,
        newPage?: IMessagePage,
        graphicalProperties?: IShapeGraphicalProps
    }
}