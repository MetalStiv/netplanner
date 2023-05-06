import IShapeCreator from "./IShapeCreator";

interface IShapeGroup {
    title: string,
    shapes: IShapeCreator[],
}
export default IShapeGroup;