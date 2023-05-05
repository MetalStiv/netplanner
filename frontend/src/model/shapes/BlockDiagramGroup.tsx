import IShape, { IShapeConfig } from "../IShape";
import IShapeCreator from "../IShapeCreator";
import IGeometryGroup from "../IGeometryGroup"

interface IBlockDiagramGroup extends IGeometryGroup { }

class PolygonsGroup implements IBlockDiagramGroup {
    title: string = 'Block Diagram';
    shapes: IShapeCreator[] = [];

    constructor(objArray: IShapeCreator[]) {
        this.shapes = objArray;
    }

}


export default PolygonsGroup;