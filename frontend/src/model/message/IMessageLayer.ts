import IShape from "../shapes/IShape";
import { IMessageShape } from "./IMessageShape";

export interface IMessageLayer {
    id?: string,
    name?: string,
    zIndex?: number,
    isVisible?: boolean,
    shapes?: IMessageShape[]
}