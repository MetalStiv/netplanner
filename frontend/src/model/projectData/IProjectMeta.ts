import IInvite from "./IInvite";

interface IProjectMeta {
    id: string,
    name: string,
    ownerId: string,
    groupId: string,
    isGroup: boolean,
    subscriberIds: string[],
    creationTime: Date,
    lastModifyTime: Date,
    hide: boolean,
    showMenu: boolean,
    showSharingForm: boolean,
    showMoveForm: boolean,
    invites: IInvite[],
    userRights: number,
}

export default IProjectMeta;