import { IMessageShape } from "./IMessageShape";
import IShape from "./IShape";
import { circleInflater } from "./shapes/Circle";

export type TShapeInflater = (message: IMessageShape) => Promise<IShape | null>;

export interface IShapeInflaters {
    inflaters: TShapeInflater[],
    inflate: (message: IMessageShape) => Promise<IShape | null>
}

export const shapeInflaters: IShapeInflaters = {
    inflaters: [
        circleInflater
    ],
    async inflate(message: IMessageShape) {
        let result: IShape | null = null;
        await this.inflaters.every(async inflater => {
            result = await inflater(message);
            if (result){
                return (false);
            }
            return true;
        })
        return result;
    }
}