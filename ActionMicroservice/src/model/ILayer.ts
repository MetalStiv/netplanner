import { ObjectId } from "mongodb";
import { IShape } from "./IShape";

export interface ILayer {
    _id: ObjectId,
    name: string,
    pageId: ObjectId,
    zIndex: number,
    isVisible: boolean
}