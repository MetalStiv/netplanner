import IShape, { IShapeProps } from "../IShape";
import IShapeCreator from "../IShapeCreator";
import IShapesGroup from "../IGeometryGroup"

interface IPrimitivesGroup extends IShapesGroup { }

class PrimitivesGroup implements IPrimitivesGroup {
    title: string = 'Primitives';
    shapes: IShapeCreator[] = [];

    constructor(objArray: IShapeCreator[]) {
        this.shapes = objArray;
    }

}


export default PrimitivesGroup;