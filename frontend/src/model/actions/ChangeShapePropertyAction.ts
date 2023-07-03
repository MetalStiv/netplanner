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

    do(): boolean {
        this.shape.config.graphicalProperties = this.newProperties;
        // this.graphProps[this.property as keyof IShapeGraphicalProps].value = this.nextState;

        // this.getKeyValue<keyof IShapeGraphicalProps, IShapeGraphicalProps>(this.property)(this.graphProps)
        return true;
    }
    undo(): void {
        this.shape.config.graphicalProperties = this.oldProperties;
        // this.item.value = this.prevState;
        // this.graphProps[this.property as keyof IShapeGraphicalProps].value = this.prevState;
    }

    getMessage(): IMessage {
        return {
            type: ActionType.CHANGE_GRAPHICAL_PROPERTY,
            layerId: this.layerID,
            shapeId: this.shape.config.id,
            data: {
                graphicalProperties: this.newProperties
                // id, property
            }
        }
    }
}