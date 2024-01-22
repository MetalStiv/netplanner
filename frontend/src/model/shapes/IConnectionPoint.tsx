import ICoords from "../../common/model/ICoords"
import { IMessageConnectionPoint } from "../message/IMessageShape"

export enum ConnectionPointTypes {
    TOP = 'top',
    RIGHT = 'right',
    BOTTOM = 'bottom',
    LEFT = 'left',
    CENTER = 'center'
}

export interface IConnectionAddress {
    shapeId: string,
    pointId: string
};

export interface IConnectionPoint {
    id: string,
    type: ConnectionPointTypes,
    relativeCoords: ICoords,
    markerOffset: ICoords,
    connectionAreaRadius: number,
    // connectedShapes: string[] | null
    connectedShapes: IConnectionAddress[] | null
};

export const calculateCPCoords = (type: ConnectionPointTypes, width: number = 1, height: number = 1): { relativeCoords: ICoords, markerOffset: ICoords } => {
    switch (type) {
        case ConnectionPointTypes.TOP:
            return {
                relativeCoords: { x: width / 2, y: 0 },
                markerOffset: { x: 0, y: -32 }
            };
        case ConnectionPointTypes.RIGHT:
            return {
                relativeCoords: { x: width, y: height / 2 },
                markerOffset: { x: 16, y: 0 }
            };
        case ConnectionPointTypes.BOTTOM:
            return {
                relativeCoords: { x: width / 2, y: height },
                markerOffset: { x: 0, y: 16 }
            };
        case ConnectionPointTypes.LEFT:
            return {
                relativeCoords: { x: 0, y: height / 2 },
                markerOffset: { x: -16, y: 0 }
            };
        case ConnectionPointTypes.CENTER:
            return {
                relativeCoords: { x: width / 2, y: height / 2 },
                markerOffset: { x: 0, y: 0 }
            };
        default:
            return {
                relativeCoords: { x: 0, y: 0 },
                markerOffset: { x: 0, y: 0 }
            };
    };
};

type TConnectionPointInflater = (message: IMessageConnectionPoint, width: number, height: number) => IConnectionPoint | null;
const topInflater: TConnectionPointInflater = (messageConnectionPoint, width, height) => {
    if (messageConnectionPoint.type !== ConnectionPointTypes.TOP) {
        return null;
    };
    return {
        id: messageConnectionPoint.id,
        type: ConnectionPointTypes.TOP,
        ...calculateCPCoords(ConnectionPointTypes.TOP, width, height),
        connectionAreaRadius: 10,
        connectedShapes: messageConnectionPoint.connectedShapes
    }
};
const rightInflater: TConnectionPointInflater = (messageConnectionPoint, width = 1, height = 1) => {
    if (messageConnectionPoint.type !== ConnectionPointTypes.RIGHT) {
        return null;
    };
    return {
        id: messageConnectionPoint.id,
        type: ConnectionPointTypes.RIGHT,
        ...calculateCPCoords(ConnectionPointTypes.RIGHT, width, height),
        connectionAreaRadius: 10,
        connectedShapes: messageConnectionPoint.connectedShapes
    }
};
const bottomInflater: TConnectionPointInflater = (messageConnectionPoint, width = 1, height = 1) => {
    if (messageConnectionPoint.type !== ConnectionPointTypes.BOTTOM) {
        return null;
    };
    return {
        id: messageConnectionPoint.id,
        type: ConnectionPointTypes.BOTTOM,
        ...calculateCPCoords(ConnectionPointTypes.BOTTOM, width, height),
        connectionAreaRadius: 10,
        connectedShapes: messageConnectionPoint.connectedShapes
    }
};
const leftInflater: TConnectionPointInflater = (messageConnectionPoint, width = 1, height = 1) => {
    if (messageConnectionPoint.type !== ConnectionPointTypes.LEFT) {
        return null;
    };
    return {
        id: messageConnectionPoint.id,
        type: ConnectionPointTypes.LEFT,
        ...calculateCPCoords(ConnectionPointTypes.LEFT, width, height),
        connectionAreaRadius: 10,
        connectedShapes: messageConnectionPoint.connectedShapes
    }
};
const centerInflater: TConnectionPointInflater = (messageConnectionPoint, width = 1, height = 1) => {
    if (messageConnectionPoint.type !== ConnectionPointTypes.CENTER) {
        return null;
    };
    return {
        id: messageConnectionPoint.id,
        type: ConnectionPointTypes.CENTER,
        ...calculateCPCoords(ConnectionPointTypes.CENTER, width, height),
        connectionAreaRadius: width > height ? width + 16 : height + 16,
        connectedShapes: messageConnectionPoint.connectedShapes
    }
};

// export type TConnectionPointInflaters = (message: IMessageConnectionPoint) => Promise<IConnectionPoint | null>;
export interface IConnectionPointInflaters {
    inflaters: TConnectionPointInflater[],
    inflate: (message: IMessageConnectionPoint, width: number, height: number) => IConnectionPoint | null
}
export const connectionPointsInflaters: IConnectionPointInflaters = {
    inflaters: [
        topInflater,
        rightInflater,
        bottomInflater,
        leftInflater,
        centerInflater,
    ],

    inflate(message, width, height) {
        let result: IConnectionPoint | null = null;
        this.inflaters.some(inflater => {
            const connectionPoint: IConnectionPoint | null = inflater(message, width, height);
            if (!connectionPoint) {
                return false;
            }
            result = connectionPoint;
            return true;
        });
        return result;
    }
}

export default IConnectionPoint;