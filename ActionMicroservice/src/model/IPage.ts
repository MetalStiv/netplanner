import { ObjectId } from "mongodb";

export interface IPage {
    _id: ObjectId,
    name: string,
    projectId: ObjectId
}