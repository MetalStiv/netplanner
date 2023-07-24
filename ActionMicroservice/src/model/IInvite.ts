import { ObjectId } from "mongodb";

export interface IInvite {
    _id: ObjectId,
    projectId: ObjectId,
    userId: ObjectId,
    inviterId: ObjectId,
    permission: number,
    state: number,
}