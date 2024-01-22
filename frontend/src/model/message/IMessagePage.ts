import { IMessageLayer } from "./IMessageLayer";

export interface IMessagePage {
    id?: string,
    name: string,
    layers?: IMessageLayer[]
}