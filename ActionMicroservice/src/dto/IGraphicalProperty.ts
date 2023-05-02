import { IShapeTree } from "./IShapeTree";

export interface IGraphicalProperty {
    label: string,
    value: string,
}

export interface IShapeGraphicalProperties {
    x: IGraphicalProperty,
    y: IGraphicalProperty,
}