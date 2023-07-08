import { SendMessage } from "react-use-websocket";
import { IAction } from "../model/actions/IAction";

const actionsSymbol: unique symbol = Symbol()
const forwardActionsSymbol: unique symbol = Symbol()
const maxSizeSymbol: unique symbol = Symbol()
const messageSenderSymbol: unique symbol = Symbol()

export interface IActionStore {
    [actionsSymbol]: IAction[],
    [forwardActionsSymbol]: IAction[],
    [maxSizeSymbol]: number,
    [messageSenderSymbol]: SendMessage | null,
    setMessageSender: (sendMessage: SendMessage) => void,
    push: (action: IAction) => void,
    back: () => void,
    forward: () => void,

    clearStore: () => void
}

export const createActionStore = () => {
    const store: IActionStore = {
        [actionsSymbol]: [],
        [forwardActionsSymbol]: [],
        [maxSizeSymbol]: 1000,
        [messageSenderSymbol]: null,

        setMessageSender(sendMessage: SendMessage) {
            this[messageSenderSymbol] = sendMessage
        },

        push(action: IAction) {
            if (action.storeHistory){
                this[actionsSymbol].length === this[maxSizeSymbol] && this[actionsSymbol].shift();
                this[actionsSymbol].push(action);
                this[forwardActionsSymbol] = []
            }
            this[messageSenderSymbol] && this[messageSenderSymbol]!(JSON.stringify(action.do()))
        },

        back() {
            const action: IAction | undefined = this[actionsSymbol].pop()
            if (!action){
                return;
            }
            this[forwardActionsSymbol].push(action);
            this[messageSenderSymbol] && this[messageSenderSymbol]!(JSON.stringify(action.undo()))
        },

        forward() {
            const action: IAction | undefined = this[forwardActionsSymbol].pop()
            if (!action){
                return;
            }
            this[actionsSymbol].length === this[maxSizeSymbol] && this[actionsSymbol].shift();
            this[actionsSymbol].push(action);
            this[messageSenderSymbol] && this[messageSenderSymbol]!(JSON.stringify(action.do()))
        },

        clearStore() {
            this[actionsSymbol] = []
        }
    }

    return store;
}

export type TActionStore = ReturnType<typeof createActionStore>