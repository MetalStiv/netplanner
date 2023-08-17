import { ObjectId } from "mongodb";
import { IDatadaseCollections } from "../app";
import { IProjectMeta } from "../model/IProjectMeta";

export const userRightsChecker = async (userId: string, projectId: string, collections: IDatadaseCollections) => {
    let res = 0;
    const project: IProjectMeta = await collections.projectMetaCollection.findOne({_id: new ObjectId(projectId)});
    if (!project){
        return 2;
    }
    if (project.ownerId.toString() === userId){
        res = 0;
    }

    if ((await collections.inviteCollection.find({
            userId: new ObjectId(userId),
            projectId: new ObjectId(projectId),
            state: 1,
            permission: 1
        }).toArray()).length > 0){
            res = 1
        }
    if ((await collections.inviteCollection.find({
            userId: new ObjectId(userId),
            projectId: new ObjectId(projectId),
            state: 1,
            permission: 0
        }).toArray()).length > 0){
            res = 0
        }

    if (project.goupId){
        return await userRightsChecker(userId, project.goupId.toString(), collections);
    }
    return res;
}