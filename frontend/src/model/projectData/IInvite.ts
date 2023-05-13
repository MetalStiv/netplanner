interface IInvite {
    id: string,
    projectId: string,
    userId: string,
    permission: number,
    state: number,
    inviterName?: string,
    isGroup?: boolean,
    projectName?: string,
}

export default IInvite