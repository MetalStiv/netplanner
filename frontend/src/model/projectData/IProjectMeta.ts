import IInvite from "./IInvite";

interface IProjectMeta {
    id: string,
    name: string,
    ownerId: string,
    groupId: string,
    isGroup: boolean,
    subscriberIds: string[],
    creationTime: string,
    hide: boolean,
    showMenu: boolean,
    showSharingForm: boolean,
    invites: IInvite[]
}

export default IProjectMeta;