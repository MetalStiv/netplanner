interface IProjectMeta {
    id: string,
    name: string,
    ownerId: string,
    subscriberIds: string[],
    creationTime: string,
    hide: boolean
}

export default IProjectMeta;