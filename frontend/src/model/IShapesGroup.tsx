import IShape from "./IShape";
import IShapeCreator from "./IShapeCreator";

interface IShapesGroup {
    title: string,
    shapes: IShapeCreator[],
    //render(): JSX.Element,
}
export default IShapesGroup;