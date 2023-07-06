import { IMessage } from "../message/IMessage";

export interface IAction {
    storeHistory: boolean,
    do(): IMessage,
    undo(): void,
}