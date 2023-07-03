import { IMessage } from "../message/IMessage";

export interface IAction {
    storeHistory: boolean,
    do(): boolean,
    undo(): void,
    getMessage(): IMessage
}