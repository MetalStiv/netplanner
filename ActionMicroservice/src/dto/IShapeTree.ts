import { IGraphicalProperty } from "./IGraphicalProperty"

export interface IShapeTree {
    id: string,
    type: string,
    zIndex: number,
    graphicalProperties: {
        x: IGraphicalProperty,
        y: IGraphicalProperty
    }
}