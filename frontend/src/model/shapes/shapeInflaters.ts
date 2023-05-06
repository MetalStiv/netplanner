import IShape from "./IShape";
import { beginEndInflater } from "./blockDiagramShapes/BeginEnd";
import { decisionInflater } from "./blockDiagramShapes/Decision";
import { inputOutputInflater } from "./blockDiagramShapes/InputOutput";
import { modificationInflater } from "./blockDiagramShapes/Modification";
import { operationInflater } from "./blockDiagramShapes/Operation";
import { processInflater } from "./blockDiagramShapes/Process";
import { repeatInflater } from "./blockDiagramShapes/Repeat";
import { circleInflater } from "./primitiveShapes/Circle";
import { IMessageShape } from "../message/IMessageShape";
import { ellipseInflater } from "./primitiveShapes/Ellipse";

export type TShapeInflater = (message: IMessageShape) => Promise<IShape | null>;

export interface IShapeInflaters {
    inflaters: TShapeInflater[],
    inflate: (message: IMessageShape) => Promise<IShape | null>
}

export const shapeInflaters: IShapeInflaters = {
    inflaters: [
        circleInflater,
        ellipseInflater,

        beginEndInflater,
        operationInflater,
        processInflater,
        decisionInflater,
        modificationInflater,
        inputOutputInflater,
        repeatInflater,
    ],
    async inflate(message: IMessageShape) {
        let result: IShape | null = null;
        await this.inflaters.every(async inflater => {
            const shape: IShape | null = await inflater(message);
            if (!shape){
                return false;
            }
            result = shape;
            return true;
        });
        return result;
    }
}