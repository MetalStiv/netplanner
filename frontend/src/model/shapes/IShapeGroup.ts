import { GroupType } from "./GroupType";
import IShapeCreator from "./IShapeCreator";
import { ShapeType } from "./ShapeType";

interface IShapeGroup {
    labelName: GroupType,
    shapes: IShapeCreator[],
}
export default IShapeGroup;