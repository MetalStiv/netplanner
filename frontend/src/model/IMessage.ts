import { IMessageShape } from "./IMessageShape"

export interface IMessage {
    id?: string,
    type: string,
    pageId?: string,
    layerId?: string,
    data: {
        id?: string,
        shape?: string, 
        zIndex?: string,
        dropCoords?: { x: number, y: number },
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