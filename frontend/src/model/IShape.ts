import { ShapeType } from "./ShapeType";

export interface IShapeGraphicalProps {
    //startCoords: { x: number, y: number },
    x: IGraphicalProperty,
    y: IGraphicalProperty,
    pivot: IGraphicalProperty
    // w: IGraphicalProperty,
    // h: IGraphicalProperty,
    //otherPropertiesView?: { title: string, value: string }[],
}

export interface IGraphicalProperty {
    label: string,
    value: string,
    isReadable: boolean,
}

export interface IShapeConfig {
    id?: string,
    graphical: IShapeGraphicalProps,
    zIndex?: number,
}

export interface IShape {
    type: ShapeType,
    config: IShapeConfig,
    isVisible: boolean,
    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void,
        handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void,
        layerZIndex: number): JSX.Element;
    //     id: string;
    //     coords: { x: number; y: number; };
    //     sizes?: { w: number; h: number; } | undefined;
    //     r?: number,
    //     rDif?: { rx: number, ry: number },
    //     startCoord?: { x1: number, y1: number },
    //     endCoord?: { x2: number, y2: number },
    //     points?: Array<[number, number]>,
    //     stroke?: string,
    //     fill?: string,
    //     pathLength?: number,
}
export default IShape;