import IShape from "./IShape";

export interface IShapeCreator {
    type: string,

    create(): IShape;
}
export default IShapeCreator;