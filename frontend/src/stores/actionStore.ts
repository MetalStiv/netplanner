import { SendMessage } from "react-use-websocket";
import { IAction } from "../model/actions/IAction";

const actionsSymbol: unique symbol = Symbol()
const maxSizeSymbol: unique symbol = Symbol()
const messageSenderSymbol: unique symbol = Symbol()

export interface IActionStore {
    [actionsSymbol]: IAction[],
    [maxSizeSymbol]: number,
    [messageSenderSymbol]: SendMessage | null,
    setMessageSender: (sendMessage: SendMessage) => void,
    push: (action: IAction) => void,
    pop: () => IAction | null,

    clearStore: () => void
}

export const createActionStore = () => {
    const store: IActionStore = {
        [actionsSymbol]: [],
        [maxSizeSymbol]: 1000,
        [messageSenderSymbol]: null,

        setMessageSender(sendMessage: SendMessage) {
            this[messageSenderSymbol] = sendMessage
        },

        push(action: IAction) {
            this[actionsSymbol].length === this[maxSizeSymbol] && this[actionsSymbol].shift();
            this[actionsSymbol].push(action);
            // console.log(JSON.stringify(action.getMessage()));
            this[messageSenderSymbol] && this[messageSenderSymbol]!(JSON.stringify(action.getMessage()))
        },

        pop() {
            return this[actionsSymbol].pop() ?? null;
        },

        clearStore() {
            this[actionsSymbol] = []
        }
    }

    return store;
}

export type TActionStore = ReturnType<typeof createActionStore>