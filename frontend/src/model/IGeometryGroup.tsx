import IShape from "./IShape";
import IShapeCreator from "./IShapeCreator";

interface IGeometryGroup {
    title: string,
    shapes: IShapeCreator[],
    //render(): JSX.Element,
}
export default IGeometryGroup;