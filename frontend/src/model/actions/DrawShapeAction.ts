import { IMessage } from "../message/IMessage";
import Layer from "../projectData/Layer";
import IShape from "../shapes/IShape";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class DrawShapeAction implements IAction {
    private shape: IShape;
    private currentLayer: Layer;
    private dropCoords: { x: number, y: number };

    constructor(shape: IShape, currentLayer: Layer, dropCoords: { x: number, y: number }) {
        this.shape = shape;
        this.currentLayer = currentLayer;
        this.dropCoords = dropCoords;
    }

    do(): boolean {
        this.shape.config.graphicalProperties.x.value = this.dropCoords.x.toString();
        this.shape.config.graphicalProperties.y.value = this.dropCoords.y.toString();
        this.shape.config.zIndex = this.currentLayer.getShapes().length + 1;
        this.currentLayer.addShape(this.shape);
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
        let zIndex = this.currentLayer.getShapes().length + 1;
        const graphProp = Object.assign(
            Object.fromEntries(Object.entries(this.shape.config.graphicalProperties).map(([key, { value }]) => [key, value])),
            {
                x: this.shape.config.graphicalProperties.x.value,
                y: this.shape.config.graphicalProperties.y.value,
                pivot: this.shape.config.graphicalProperties.pivot.value,
            }
        )

        return {
            type: ActionType.ADD_SHAPE,
            layerId: this.currentLayer.getID(),
            data: {
                newShape: {
                    ...{ zIndex },
                    isVisible: this.shape.isVisible,
                    type: this.shape.type,
                    graphicalProperties: graphProp
                },
                // zIndex: this.shape.config.zIndex?.toString()
            }
        }
    }
}