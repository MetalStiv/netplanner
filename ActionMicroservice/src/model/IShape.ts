import { ObjectId } from "mongodb";
// import { IGraphicalProperty } from "../dto/IGraphicalProperty";

export interface IConnectionAddress {
    shapeId: string,
    pointId: string
};

export interface IConnectionPoint {
    _id: ObjectId,
    type: string,
    connectedShapes: IConnectionAddress[] | null
}

export interface IShape {
    _id: ObjectId,
    type: string,
    layerId: ObjectId,
    zIndex: number,
    graphicalProperties: {
        x: string,
        y: string,
        pivot: string,
    },
    objectProperties: {
        id: string,
    },
    connectionPoints: IConnectionPoint[]
}