export interface IShapeTree {
    id: string,
    type: string,
    zIndex: string,
    graphicalProperties: {
        label: string,
        value: string,
        isReadable: boolean
    }[]
}