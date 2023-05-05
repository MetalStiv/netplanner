import { IMessageShape } from "./IMessageShape";
import IShape from "./IShape";
import { beginEndInflater } from "./shapes/blockDiagramShapes/BeginEnd";
import { decisionInflater } from "./shapes/blockDiagramShapes/Decision";
import { inputOutputInflater } from "./shapes/blockDiagramShapes/InputOutput";
import { modificationInflater } from "./shapes/blockDiagramShapes/Modification";
import { operationInflater } from "./shapes/blockDiagramShapes/Operation";
import { processInflater } from "./shapes/blockDiagramShapes/Process";
import { repeatInflater } from "./shapes/blockDiagramShapes/Repeat";
import { circleInflater } from "./shapes/primitiveShapes/Circle";

export type TShapeInflater = (message: IMessageShape) => Promise<IShape | null>;

export interface IShapeInflaters {
    inflaters: TShapeInflater[],
    inflate: (message: IMessageShape) => Promise<IShape | null>
}

export const shapeInflaters: IShapeInflaters = {
    inflaters: [
        circleInflater,

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