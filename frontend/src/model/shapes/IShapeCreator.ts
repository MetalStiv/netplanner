import { ShapeType } from "./ShapeType";
import IShape from "./IShape";

export interface IShapeCreator {
    type: ShapeType,
    create(): IShape;
}
export default IShapeCreator;