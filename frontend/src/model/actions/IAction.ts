import { IMessage } from "../message/IMessage";

export interface IAction {
    do(): boolean,
    undo(): void,
    getMessage(): IMessage
}