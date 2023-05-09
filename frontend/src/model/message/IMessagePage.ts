import { ILayer } from "../projectData/Layer";
import { IMessageLayer } from "./IMessageLayer";

export interface IMessagePage {
    id?: string,
    name: string,
    layers?: IMessageLayer[]
}