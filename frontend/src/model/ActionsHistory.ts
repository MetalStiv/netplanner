import { IAction } from "./Action";

class ActionsHistory {
    private history: IAction[] = [];
    private readonly maxSize = 1000;

    constructor(defaultHistory?: IAction[]) {
        this.history =
            defaultHistory
                ? (defaultHistory.length > this.maxSize)
                    ? defaultHistory.slice(defaultHistory.length - this.maxSize)
                    : defaultHistory
                : [];
    }

    push(action: IAction) {
        this.history.length === this.maxSize && this.history.shift();
        this.history.push(action);
    }
    pop() {
        return this.history.pop();
    }
}
export default ActionsHistory;