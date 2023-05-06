import { ShapeType } from "./ShapeType";

export interface IShapeGraphicalProps {
    x: IGraphicalProperty,
    y: IGraphicalProperty,
    pivot: IGraphicalProperty
}

export interface IGraphicalProperty {
    label: string,
    value: string,
    isReadable: boolean,
}

export interface IShapeConfig {
    id?: string,
    graphicalProperties: IShapeGraphicalProps,
    zIndex?: number,
}

export interface IShape {
    type: ShapeType,
    config: IShapeConfig,
    isVisible: boolean,
    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void,
        handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void,
        layerZIndex: number): JSX.Element;
}

export default IShape;