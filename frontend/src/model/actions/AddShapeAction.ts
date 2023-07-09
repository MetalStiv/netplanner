import { IMessage } from "../message/IMessage";
import Layer from "../projectData/Layer";
import IShape, { GraphicalPropertyTypes } from "../shapes/IShape";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class AddShapeAction implements IAction {
    uid: string;
    storeHistory: boolean = true;
    
    private shape: IShape;
    private currentLayer: Layer;
    private dropCoords: { x: number, y: number };

    constructor(shape: IShape, currentLayer: Layer, dropCoords: { x: number, y: number }) {
        this.shape = shape;
        this.currentLayer = currentLayer;
        this.dropCoords = dropCoords;
        this.uid = (+new Date).toString(36).slice(-5);
    }

    undo(): IMessage {
        return {
            type: ActionType.DELETE_SHAPE,
            shapeId: this.shape.config.id
        }
    }

    do(): IMessage {
        this.shape.config.graphicalProperties[GraphicalPropertyTypes.X].value = this.dropCoords.x.toString();
        this.shape.config.graphicalProperties[GraphicalPropertyTypes.Y].value = this.dropCoords.y.toString();

        const messageProperties: {l: string, v: string}[] = []
        let graphicalProperty: keyof typeof this.shape.config.graphicalProperties; 
        for (graphicalProperty in this.shape.config.graphicalProperties){
            messageProperties.push({l: graphicalProperty, 
                v: this.shape.config.graphicalProperties[graphicalProperty].value})
        }

        return {
            type: ActionType.ADD_SHAPE,
            uid: this.uid,
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

    setShapeId(id: string): void {
        this.shape.config.id = id
    }
}