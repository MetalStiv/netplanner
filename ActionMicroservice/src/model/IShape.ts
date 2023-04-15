import { ObjectId } from "mongodb";

export interface IShape {
    _id: ObjectId,
    type: string,
    layerId: ObjectId,
    graphicalProperties: {
        x: string,
        y: string
    }
}