import { IMessage } from "../message/IMessage";

export interface IAction {
    uid: string,
    storeHistory: boolean,
    do(): IMessage,
    undo(): IMessage,
}