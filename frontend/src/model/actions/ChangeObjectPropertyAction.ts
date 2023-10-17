import { IMessage } from "../message/IMessage";
import IShape, { IShapeObjectProps } from "../shapes/IShape";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class ChangeObjectPropertyAction implements IAction {
    uid: string;
    storeHistory: boolean = true;
    
    private shape: IShape;
    private layerID: string;
    private oldProperties: IShapeObjectProps;
    private newProperties: IShapeObjectProps;

    constructor(shape: IShape, layerID: string, newProperties: IShapeObjectProps) {
        this.shape = shape;
        this.layerID = layerID;
        this.oldProperties = Object.assign({}, shape.config.objectProperties);
        this.newProperties = newProperties;
        this.uid = (+new Date).toString(36).slice(-5);
    }

    undo(): IMessage {
        const messageProperties: {l: string, v: string}[] = []
        let objectProperty: keyof typeof this.oldProperties; 
        for (objectProperty in this.oldProperties){
            messageProperties.push({l: objectProperty, 
                v: this.oldProperties[objectProperty].value})
        }

        return {
            type: ActionType.CHANGE_OBJECT_PROPERTY,
            layerId: this.layerID,
            shapeId: this.shape.config.id,
            data: {
                objectProperties: messageProperties
            }
        }
    }

    do(): IMessage {
        const messageProperties: {l: string, v: string}[] = []
        let objectProperty: keyof typeof this.newProperties; 
        for (objectProperty in this.newProperties){
            messageProperties.push({l: objectProperty, 
                v: this.newProperties[objectProperty].value})
        }

        return {
            type: ActionType.CHANGE_OBJECT_PROPERTY,
            layerId: this.layerID,
            shapeId: this.shape.config.id,
            data: {
                objectProperties: messageProperties
            }
        }
    }
}