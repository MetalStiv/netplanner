import { IMessage } from "./IMessage";
import IShape, { IGraphProp } from "./IShape";
import Page from "./Page";

export interface IAction {
    do(): boolean,
    undo(): void,
    getMessage(): IMessage
}

export enum ActionType {
    OPEN_PROJECT = "OPEN_PROJECT",

    ADD_PAGE = "ADD_PAGE",
    REMOVE_PAGE = "REMOVE_PAGE",
    RENAME_PAGE = "RENAME_PAGE",

    ADD_LAYER = "ADD_LAYER",
    REMOVE_LAYER = "REMOVE_LAYER",
    RENAME_LAYER = "RENAME_LAYER",

    ADD_SHAPE = "ADD_SHAPE",
    CHANGE_GRAPHICAL_PROPERTY = "CHANGE_GRAPHICAL_PROPERTY"
}

export class DrawShapeAction implements IAction {
    private shape: IShape;
    private currentPage: Page;
    private dropCoords: { x: number, y: number };

    constructor(shape: IShape, currentPage: Page, dropCoords: { x: number, y: number }) {
        this.shape = shape;
        this.currentPage = currentPage;
        this.dropCoords = dropCoords;
    }

    do(): boolean {
        this.shape.config.graphical.x.value = this.dropCoords.x.toString();
        this.shape.config.graphical.y.value = this.dropCoords.y.toString();
        this.currentPage.getCurrentLayer().addElem(this.shape);
        return true;
    }

    undo(): void {
        const layer = this.currentPage.getLayers().find(layer => layer.getElems().some(elem => elem === this.shape))
        layer?.removeElem(this.shape);
    }

    getMessage(): IMessage {
        return {
            type: ActionType.ADD_SHAPE,
            pageId: this.currentPage.id,
            layerId: this.currentPage.getCurrentLayer().id,
            data: {
                shape: this.shape.type,
                zIndex: this.shape.config.zIndex?.toString(),
                dropCoords: {
                    x: this.dropCoords.x,
                    y: this.dropCoords.y
                }
            }
        }
    }
}

export class ChangeShapePropertyAction implements IAction {
    // private graphProps: IShapeGraphicalProps;
    // private property: string;
    private item: IGraphProp;
    private prevState: string;
    private nextState: string;

    constructor(item: IGraphProp, prevState: string, nextState: string) {
        // this.graphProps = graphProps;
        // this.property = property;
        this.item = item;
        this.prevState = prevState;
        this.nextState = nextState;
    }

    // getKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T) =>
    // obj[key];

    do(): boolean {
        this.item.value = this.nextState;
        // this.graphProps[this.property as keyof IShapeGraphicalProps].value = this.nextState;

        // this.getKeyValue<keyof IShapeGraphicalProps, IShapeGraphicalProps>(this.property)(this.graphProps)
        return true;
    }
    undo(): void {
        this.item.value = this.prevState;
        // this.graphProps[this.property as keyof IShapeGraphicalProps].value = this.prevState;
    }

    getMessage(): IMessage {
        return {
            type: ActionType.CHANGE_GRAPHICAL_PROPERTY,
            data: {
                // id, property
            }
        }
    }
}

// export class UndoAction implements IAction {
//     private history: ActionsHistory;

//     constructor(history: ActionsHistory) {
//         this.history = history;
//     }
//     do(): boolean {
//         this.history.pop();
//         return false;
//     }
//     undo(): void { }
// }


export default IAction;