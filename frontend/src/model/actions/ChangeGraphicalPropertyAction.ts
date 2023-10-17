import { IMessage } from "../message/IMessage";
import IShape, { IShapeGraphicalProps } from "../shapes/IShape";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class ChangeGraphicalPropertyAction implements IAction {
    uid: string;
    storeHistory: boolean = true;
    
    private shape: IShape;
    private layerID: string;
    private oldProperties: IShapeGraphicalProps;
    private newProperties: IShapeGraphicalProps;

    constructor(shape: IShape, layerID: string, newProperties: IShapeGraphicalProps) {
        this.shape = shape;
        this.layerID = layerID;
        this.oldProperties = Object.assign({}, shape.config.graphicalProperties);
        this.newProperties = newProperties;
        this.uid = (+new Date).toString(36).slice(-5);
    }

    undo(): IMessage {
        const messageProperties: {l: string, v: string}[] = []
        let graphicalProperty: keyof typeof this.oldProperties; 
        for (graphicalProperty in this.oldProperties){
            messageProperties.push({l: graphicalProperty, 
                v: this.oldProperties[graphicalProperty].value})
        }

        return {
            type: ActionType.CHANGE_GRAPHICAL_PROPERTY,
            layerId: this.layerID,
            shapeId: this.shape.config.id,
            data: {
                graphicalProperties: messageProperties
            }
        }
    }

    do(): IMessage {
        const messageProperties: {l: string, v: string}[] = []
        let graphicalProperty: keyof typeof this.newProperties; 
        for (graphicalProperty in this.newProperties){
            messageProperties.push({l: graphicalProperty, 
                v: this.newProperties[graphicalProperty].value})
        }

        return {
            type: ActionType.CHANGE_GRAPHICAL_PROPERTY,
            layerId: this.layerID,
            shapeId: this.shape.config.id,
            data: {
                graphicalProperties: messageProperties
            }
        }
    }
}