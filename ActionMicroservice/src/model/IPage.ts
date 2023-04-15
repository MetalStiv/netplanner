import { ObjectId } from "mongodb";
import { ILayer } from "./ILayer";

export interface IPage {
    _id: ObjectId,
    name: string,
    projectId: ObjectId
}