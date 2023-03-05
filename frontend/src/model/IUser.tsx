interface IUser {
    id: string,
    email?: string,
    name: string,
    avatarBase64?: string,
    timeZoneId: number,
}

export default IUser