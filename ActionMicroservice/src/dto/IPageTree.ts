import { ILayerTree } from "./ILayerTree";

export interface IPageTree {
    id: string,
    name: string,
    layers: ILayerTree[]
}