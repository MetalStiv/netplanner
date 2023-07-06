import { IGraphicalProperty } from "../shapes/IShape";

export interface IMessageGraphicalProperty {
    l: string,
    v: string,
}

export interface IMessageShape {
    id?: string,
    type: string,
    zIndex: number,
    graphicalProperties: IMessageGraphicalProperty[]
}