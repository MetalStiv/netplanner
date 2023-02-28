interface IProjectMeta {
    id: string,
    name: string,
    ownerId: string,
    subscriberIds: string[],
    creationTime: string,
    hide: boolean,
    showMenu: boolean
}

export default IProjectMeta;