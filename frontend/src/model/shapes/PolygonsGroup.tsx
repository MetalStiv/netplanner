import IShape, { IShapeConfig } from "../IShape";
import IShapeCreator from "../IShapeCreator";
import IGeometryGroup from "../IGeometryGroup"

interface IPolygonsGroup extends IGeometryGroup { }

class PolygonsGroup implements IPolygonsGroup {
    title: string = 'Polygons';
    shapes: IShapeCreator[] = [];

    constructor(objArray: IShapeCreator[]) {
        this.shapes = objArray;
    }

}


export default PolygonsGroup;