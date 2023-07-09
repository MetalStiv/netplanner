import { IMessage } from "../message/IMessage";
import IShape from "../shapes/IShape";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class DeleteShapeAction implements IAction {
    uid: string;
    storeHistory: boolean = true;

    private shape: IShape;
    private layerId: string;

    constructor(shape: IShape, layerId: string) {
        this.shape = shape;
        this.layerId = layerId;
        this.uid = (+new Date).toString(36).slice(-5);
    }

    undo(): IMessage {
        const messageProperties: {l: string, v: string}[] = []
        let graphicalProperty: keyof typeof this.shape.config.graphicalProperties; 
        for (graphicalProperty in this.shape.config.graphicalProperties){
            messageProperties.push({l: graphicalProperty, 
                v: this.shape.config.graphicalProperties[graphicalProperty].value})
        }

        return {
            type: ActionType.ADD_SHAPE,
            layerId: this.layerId,
            data: {
                newShape: {
                    zIndex: this.shape.config.zIndex!,
                    type: this.shape.type,
                    graphicalProperties: messageProperties
                },
            }
        }
    }

    do(): IMessage {
        return {
            type: ActionType.DELETE_SHAPE,
            shapeId: this.shape.config.id
        }
    }
}