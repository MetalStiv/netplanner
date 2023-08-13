import { GroupType } from "../GroupType";
import IShapeGroup from "../IShapeGroup";
import { CircleCreator } from "./Circle";
import { EllipseCreator } from "./Ellipse";
import { LineCreator } from "./Line";
import { PolylineCreator } from "./Polyline";
import { RectCreator } from "./Rect";

const primitiveGroup: IShapeGroup = {
    labelName: GroupType.PRIMITIVES,
    shapes: [
        new CircleCreator(),
        new EllipseCreator(),
        // new LineCreator(),
        // new PolylineCreator(),
        new RectCreator(),
    ]
}

export default primitiveGroup;