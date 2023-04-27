import { ObjectId } from "mongodb";

export interface IShape {
    _id: ObjectId,
    type: string,
    layerId: ObjectId,
    zIndex: number,
    graphicalProperties: {
        label: string,
        value: string,
        isReadable: boolean
    }[]
}