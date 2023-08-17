interface IUser {
    id: string,
    email?: string,
    name: string,
    avatarBase64?: string,
    timeZoneId: number,
    appVersion?: number,
}

export default IUser