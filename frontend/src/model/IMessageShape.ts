import { IGraphicalProperty } from "./IShape"

export interface IMessageShape {
    id?: string,
    type: string,
    graphicalProperties: {
        x: IGraphicalProperty,
        y: IGraphicalProperty
    }
}