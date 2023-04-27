export interface IMessageShape {
    id?: string,
    type: string,
    graphicalProperties: {
        label: string,
        value: string,
        isReadable: boolean,
    }[]
}