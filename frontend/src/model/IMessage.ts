import { IMessageShape } from "./IMessageShape"

export interface IMessage {
    type: string,
    pageId?: string,
    layerId?: string,
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
        newShape?: IMessageShape
    }
}