import { IGraphicalProperty } from "../shapes/IShape";

export interface IMessageProperty {
    l: string,
    v: string,
}

export interface IMessageShape {
    id?: string,
    type: string,
    zIndex: number,
    graphicalProperties: IMessageProperty[],
    objectProperties: IMessageProperty[],
}