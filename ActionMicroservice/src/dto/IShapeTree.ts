import { IConnectionPointTree } from "./IConnectionPointTree"

export interface IShapeTree {
    id: string,
    type: string,
    zIndex: number,
    graphicalProperties: {
        x: string,
        y: string,
        pivot: string
    },
    objectProperties: {
        id: string,
    },
    connectionPoints: IConnectionPointTree[]
}