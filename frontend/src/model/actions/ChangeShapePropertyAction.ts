import { IMessage } from "../message/IMessage";
import IShape, { IShapeGraphicalProps } from "../shapes/IShape";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class ChangeShapePropertyAction implements IAction {
    storeHistory: boolean = true;
    
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
        this.oldProperties = { ...shape.config.graphicalProperties };
        this.newProperties = newProperties;
    }
    // getKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T) =>
    // obj[key];
    undo(): void {
        this.shape.config.graphicalProperties = this.oldProperties;
        // this.item.value = this.prevState;
        // this.graphProps[this.property as keyof IShapeGraphicalProps].value = this.prevState;
    }

    do(): IMessage {
        const messageProperties: {l: string, v: string}[] = []
        let graphicalProperty: keyof typeof this.shape.config.graphicalProperties; 
        for (graphicalProperty in this.shape.config.graphicalProperties){
            messageProperties.push({l: graphicalProperty, 
                v: this.shape.config.graphicalProperties[graphicalProperty].value})
        }

        return {
            type: ActionType.CHANGE_GRAPHICAL_PROPERTY,
            layerId: this.layerID,
            shapeId: this.shape.config.id,
            data: {
                graphicalProperties: messageProperties
                // id, property
            }
        }
    }
}