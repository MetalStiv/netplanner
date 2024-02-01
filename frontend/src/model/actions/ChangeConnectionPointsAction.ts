import { IMessage } from "../message/IMessage";
import IConnectionPoint from "../shapes/IConnectionPoint";
import IShape from "../shapes/IShape";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class ChangeConnectionPointsAction implements IAction {
    uid: string;
    storeHistory: boolean = true;

    private shape: IShape;
    private secondShape: IShape;
    private oldConnectionPoints: IConnectionPoint[];
    private newConnectionPoints: IConnectionPoint[];
    private secondShapeOldConnectionPoints: IConnectionPoint[];
    private secondShapeNewConnectionPoints: IConnectionPoint[];

    constructor(
        shape: IShape,
        secondShape: IShape,
        newPoints: IConnectionPoint[],
        secondShapeNewPoints: IConnectionPoint[]
    ) {
        this.shape = shape;
        this.secondShape = secondShape;
        this.oldConnectionPoints = JSON.parse(JSON.stringify(shape.config.connectionPoints));
        this.newConnectionPoints = newPoints;
        this.secondShapeOldConnectionPoints = JSON.parse(JSON.stringify(secondShape.config.connectionPoints));
        this.secondShapeNewConnectionPoints = secondShapeNewPoints;
        this.uid = (+new Date()).toString(36).slice(-5);
    }

    undo(): IMessage {
        return {
            type: ActionType.CHANGE_CONNECTION_POINTS,
            data: {
                shapesIds: [this.shape.config.id!, this.secondShape.config.id!],
                connectionPoints: [
                    this.oldConnectionPoints,
                    this.secondShapeOldConnectionPoints
                ].map(points => points.map(({ id, type, connectedShapes }) => ({ id, type, connectedShapes })))
            }
        }
    }

    do(): IMessage {
        return {
            type: ActionType.CHANGE_CONNECTION_POINTS,
            data: {
                shapesIds: [this.shape.config.id!, this.secondShape.config.id!],
                connectionPoints: [
                    this.newConnectionPoints,
                    this.secondShapeNewConnectionPoints
                ].map(points => points.map(({ id, type, connectedShapes }) => ({ id, type, connectedShapes })))
            }
        }
    }
}