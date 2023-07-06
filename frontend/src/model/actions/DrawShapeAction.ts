import { IMessage } from "../message/IMessage";
import Layer from "../projectData/Layer";
import Page from "../projectData/Page";
import IShape from "../shapes/IShape";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class DrawShapeAction implements IAction {
    storeHistory: boolean = true;
    
    private shape: IShape;
    private currentLayer: Layer;
    private dropCoords: { x: number, y: number };

    constructor(shape: IShape, currentLayer: Layer, dropCoords: { x: number, y: number }) {
        this.shape = shape;
        this.currentLayer = currentLayer;
        this.dropCoords = dropCoords;
    }

    undo(): void {
        // const layer = this.currentPage.getLayers().find(layer => layer.getShapes().some(elem => elem === this.shape));
        // layer?.removeShape(this.shape);
    }

    do(): IMessage {
        this.shape.config.graphicalProperties.x.value = this.dropCoords.x.toString();
        this.shape.config.graphicalProperties.y.value = this.dropCoords.y.toString();

        const messageProperties: {l: string, v: string}[] = []
        let graphicalProperty: keyof typeof this.shape.config.graphicalProperties; 
        for (graphicalProperty in this.shape.config.graphicalProperties){
            messageProperties.push({l: graphicalProperty, 
                v: this.shape.config.graphicalProperties[graphicalProperty].value})
        }

        return {
            type: ActionType.ADD_SHAPE,
            layerId: this.currentLayer.getID(),
            data: {
                newShape: {
                    zIndex: this.shape.config.zIndex!,
                    type: this.shape.type,
                    graphicalProperties: messageProperties
                },
                // zIndex: this.shape.config.zIndex?.toString()
            }
        }
    }
}