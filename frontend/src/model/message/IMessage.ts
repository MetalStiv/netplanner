import { IMessageShape } from "./IMessageShape"
import { IShapeGraphicalProps } from "../shapes/IShape"

export interface IMessage {
    type: string,
    pageId?: string,
    layerId?: string,
    shapeId?: string,
    data: {
        zIndex?: string,
        pages?: [{
            id: string,
            name: string,
            layers: [{
                id: string,
                name: string,
                shapes: IMessageShape[]
            }]
        }],
        newShape?: IMessageShape,
        graphicalProperties?: IShapeGraphicalProps
    }
}