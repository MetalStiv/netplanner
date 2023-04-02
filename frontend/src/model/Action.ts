import IShape from "./IShape";
import Page from "./Page";

export interface IAction {
    do(): boolean,
    undo(): void
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