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
        // this.oldProperties = { ...shape.config.graphicalProperties };
        
        this.oldProperties = Object.assign({}, shape.config.graphicalProperties);
        // let graphicalProperty: keyof typeof this.shape.config.graphicalProperties;
        // for (graphicalProperty in this.shape.config.graphicalProperties){
        //     this.oldProperties({l: graphicalProperty, 
        //         v: this.shape.config.graphicalProperties[graphicalProperty].value})
        // }

        this.newProperties = newProperties;
        console.log(this)
    }
    // getKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T) =>
    // obj[key];
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