import { ObjectId } from "mongodb";
// import { IGraphicalProperty } from "../dto/IGraphicalProperty";

export interface IShape {
    _id: ObjectId,
    type: string,
    layerId: ObjectId,
    zIndex: number,
    graphicalProperties: {
        x: string,
        y: string,
        pivot: string,
    }
}