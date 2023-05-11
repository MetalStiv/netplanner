import { IShapeTree } from "./IShapeTree";

export interface ILayerTree {
    id: string,
    name: string,
    zIndex: number,
    shapes: IShapeTree[]
}