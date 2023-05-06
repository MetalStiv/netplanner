import { IMessage } from "../message/IMessage";
import Page from "../projectData/Page";
import IShape from "../shapes/IShape";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

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
        this.shape.config.graphicalProperties.x.value = this.dropCoords.x.toString();
        this.shape.config.graphicalProperties.y.value = this.dropCoords.y.toString();
        this.currentPage.getCurrentLayer().addShape(this.shape);
        console.log(this.shape)
        return true;
    }

    undo(): void {
        // const layer = this.currentPage.getLayers().find(layer => layer.getShapes().some(elem => elem === this.shape));
        // layer?.removeShape(this.shape);
    }

    getMessage(): IMessage {
        this.shape.config.graphicalProperties.x.value = this.dropCoords.x.toString();
        this.shape.config.graphicalProperties.y.value = this.dropCoords.y.toString();

        return {
            type: ActionType.ADD_SHAPE,
            pageId: this.currentPage.getID(),
            layerId: this.currentPage.getCurrentLayer().getID(),
            data: {
                newShape: {
                    type: this.shape.type,
                    graphicalProperties: this.shape.config.graphicalProperties
                },
                zIndex: this.shape.config.zIndex?.toString()
            }
        }
    }
}