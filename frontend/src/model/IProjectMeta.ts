interface IProjectMeta {
    id: string,
    name: string,
    ownerId: string,
    groupId: string,
    isGroup: boolean,
    subscriberIds: string[],
    creationTime: string,
    hide: boolean,
    showMenu: boolean
}

export default IProjectMeta;