import IShape from "../shapes/IShape";

export interface IMessageLayer {
    id?: string,
    name?: string,
    zIndex?: number,
    isVisible?: boolean,
    shapes?: IShape[]
}