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
        const messageGraphicalProperties: { l: string, v: string | string[] }[] = []
        let graphicalProperty: keyof typeof this.shape.config.graphicalProperties;
        for (graphicalProperty in this.shape.config.graphicalProperties) {
            messageGraphicalProperties.push({
                l: graphicalProperty,
                v: this.shape.config.graphicalProperties[graphicalProperty].value
            })
        }

        const messageObjectProperties: { l: string, v: string | string[] }[] = []
        let objectProperty: keyof typeof this.shape.config.objectProperties;
        for (objectProperty in this.shape.config.objectProperties) {
            messageObjectProperties.push({
                l: objectProperty,
                v: this.shape.config.objectProperties[objectProperty].value
            })
        }

        return {
            type: ActionType.ADD_SHAPE,
            layerId: this.layerId,
            data: {
                newShape: {
                    zIndex: this.shape.config.zIndex!,
                    type: this.shape.type,
                    graphicalProperties: messageGraphicalProperties,
                    objectProperties: messageObjectProperties,
                    connectionPoints: this.shape.config.connectionPoints ?? []
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