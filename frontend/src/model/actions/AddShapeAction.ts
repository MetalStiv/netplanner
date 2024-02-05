import ICoords from "../../common/model/ICoords";
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
    private dropCoords: ICoords;

    constructor(shape: IShape, currentLayer: Layer, dropCoords: ICoords) {
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
            uid: this.uid,
            layerId: this.currentLayer.getID(),
            data: {
                newShape: {
                    zIndex: this.shape.config.zIndex!,
                    type: this.shape.type,
                    graphicalProperties: messageGraphicalProperties,
                    objectProperties: messageObjectProperties,
                    connectionPoints: (this.shape.config.connectionPoints ?? [])
                        .map(({ id, type, connectedShapes }) => ({ id, type, connectedShapes })),
                },
                // zIndex: this.shape.config.zIndex?.toString()
            }
        }
    }

    setShapeId(id: string): void {
        this.shape.config.id = id
    }
}