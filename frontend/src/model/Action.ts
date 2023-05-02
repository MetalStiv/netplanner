import { IMessage } from "./IMessage";
import IShape, { IGraphicalProperty, IShapeGraphicalProps } from "./IShape";
import { ILayer } from "./Layer";
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
        this.currentPage.getCurrentLayer().addShape(this.shape);
        console.log(this.shape)
        return true;
    }

    undo(): void {
        const layer = this.currentPage.getLayers().find(layer => layer.getShapes().some(elem => elem === this.shape));
        layer?.removeShape(this.shape);
    }

    getMessage(): IMessage {
        return {
            type: ActionType.ADD_SHAPE,
            pageId: this.currentPage.getID(),
            layerId: this.currentPage.getCurrentLayer().getID(),
            data: {
                newShape: {
                    type: this.shape.type,
                    graphicalProperties: {
                        x: {
                            label: "X",
                            value: this.dropCoords.x.toString(),
                            isReadable: true
                        },
                        y: {
                            label: "Y",
                            value: this.dropCoords.y.toString(),
                            isReadable: true
                        },
                        // this.shape.config.graphical
                    }
                },
                zIndex: this.shape.config.zIndex?.toString()
            }
        }
    }
}

export class ChangeShapePropertyAction implements IAction {
    // private graphProps: IShapeGraphicalProps;
    // private property: string;
    private shape: IShape;
    private layerID: string;
    private oldProperties: IShapeGraphicalProps;
    private newProperties: IShapeGraphicalProps;

    constructor(shape: IShape, layerID: string, newProperties: IShapeGraphicalProps) {
        this.shape = shape;
        this.layerID = layerID;
        // this.currentPage = currentPage;
        this.oldProperties = { ...shape.config.graphical };
        this.newProperties = newProperties;
    }
    // getKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T) =>
    // obj[key];

    do(): boolean {
        this.shape.config.graphical = this.newProperties;
        // this.graphProps[this.property as keyof IShapeGraphicalProps].value = this.nextState;

        // this.getKeyValue<keyof IShapeGraphicalProps, IShapeGraphicalProps>(this.property)(this.graphProps)
        return true;
    }
    undo(): void {
        this.shape.config.graphical = this.oldProperties;
        // this.item.value = this.prevState;
        // this.graphProps[this.property as keyof IShapeGraphicalProps].value = this.prevState;
    }

    getMessage(): IMessage {
        return {
            type: ActionType.CHANGE_GRAPHICAL_PROPERTY,
            layerId: this.layerID,
            shapeId: this.shape.config.id,
            data: {
                graphicalProperties: this.newProperties
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