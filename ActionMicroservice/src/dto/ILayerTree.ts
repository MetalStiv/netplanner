import { IShapeTree } from "./IShapeTree";

export interface ILayerTree{
    id: string,
    name: string,
    zIndex: string,
    shapes: IShapeTree[]
}