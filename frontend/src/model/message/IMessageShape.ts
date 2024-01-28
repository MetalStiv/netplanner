import { IConnectionAddress } from "../shapes/IConnectionPoint";
// import { IGraphicalProperty } from "../shapes/IShape";

export interface IMessageProperty {
    l: string,
    v: string | string[],
}

export interface IMessageConnectionPoint {
    id: string,
    type: string,
    connectedShapes: IConnectionAddress[] | null
}

export interface IMessageShape {
    id?: string,
    type: string,
    zIndex: number,
    graphicalProperties: IMessageProperty[],
    objectProperties: IMessageProperty[],
    connectionPoints: IMessageConnectionPoint[]
}