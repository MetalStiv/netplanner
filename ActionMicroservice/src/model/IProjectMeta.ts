import { ObjectId } from "mongodb";

export interface IProjectMeta {
    _id: ObjectId,
    name: string,
    ownerId: ObjectId,
    goupId: ObjectId,
    creationTime: Date,
    lastModifyTime: Date,
    isGroup: boolean,
}