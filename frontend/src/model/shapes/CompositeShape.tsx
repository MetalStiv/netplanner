import IShape, { IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "./IShape";
import { ShapeType } from "./ShapeType";

interface ICompositeGraphicalProps extends IShapeGraphicalProps {
    height: IGraphicalProperty,
    width: IGraphicalProperty,
    strokeColor: IGraphicalProperty,
    fillColorOne: IGraphicalProperty,
}

export interface ICompositeConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: ICompositeGraphicalProps,
    zIndex: number,
}

class CompositeShape implements IShape {
    type: ShapeType = ShapeType.COMPOSITE;
    config: IShapeConfig;
    isVisible: boolean = true;
    subShapes: IShape[] = []

    constructor(obj: ICompositeConfig, subShapes: IShape[]) {
        this.config = obj;
        this.config.zIndex = obj.zIndex ?? 0;
        this.subShapes = subShapes;
    }
    
    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void,
        handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void,
        layerZIndex: number): JSX.Element {
            return <>
                {
                    this.subShapes.map(s => s.render(handlerMouseDown, handlerClick, layerZIndex))
                }
            </>
        };
}

export default CompositeShape;