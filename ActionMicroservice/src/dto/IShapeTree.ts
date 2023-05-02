import { IGraphicalProperty } from "./IGraphicalProperty"

export interface IShapeTree {
    id: string,
    type: string,
    zIndex: string,
    graphicalProperties: {
        x: IGraphicalProperty,
        y: IGraphicalProperty
    }
}