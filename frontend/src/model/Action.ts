import IShape from "./IShape";
import Page from "./Page";

export interface IMessage {
    id?: string,
    type: string,
    pageId?: string,
    layerId?: string,
    data: object
}

export interface IAction {
    do(): boolean,
    undo(): void,
    getMessage(): IMessage
}

export interface IActionTypes {
    ADD_PAGE: string,
    REMOVE_PAGE: string,
    RENAME_PAGE: string,

    ADD_LAYER: string,
    REMOVE_LAYER: string,
    RENAME_LAYER: string,

    ADD_SHAPE: string,
    CHANGE_GRAPHICAL_PROPERTY: string
}

export const ActionTypes: IActionTypes = {
    ADD_PAGE: "ADD_PAGE",
    REMOVE_PAGE: "REMOVE_PAGE",
    RENAME_PAGE: "RENAME_PAGE",

    ADD_LAYER: "ADD_LAYER",
    REMOVE_LAYER: "REMOVE_LAYER",
    RENAME_LAYER: "RENAME_LAYER",

    ADD_SHAPE: "ADD_SHAPE",
    CHANGE_GRAPHICAL_PROPERTY: "CHANGE_GRAPHICAL_PROPERTY"
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
            type: ActionTypes.ADD_SHAPE,
            pageId: "",
            layerId: "643a6f865e560d17cc9e8b61",
            data: {
                shape: this.shape.type,
                dropCoords: {
                    x: this.dropCoords.x.toString(),
                    y: this.dropCoords.y.toString()
                }
            }
        }
    }
}

// export class ChangeShapePropertyAction implements IAction {
//     private shape: IShape;
//     private property: any;

//     constructor(shape: IShape, property: any) {
//         this.shape = shape;
//         this.property = property;
//     }

//     do(): boolean {

//         return true;
//     }
//     undo(): void {

//     }
// }

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