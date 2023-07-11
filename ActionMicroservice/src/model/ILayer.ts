import { ObjectId } from "mongodb";

export interface ILayer {
    _id: ObjectId,
    name: string,
    pageId: ObjectId,
    zIndex: number,
    isVisible: boolean
}