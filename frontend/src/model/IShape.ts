export interface IShapeGraphicalProps {
    //startCoords: { x: number, y: number },
    x: IGraphProp,
    y: IGraphProp,
    // w: IGraphProp,
    // h: IGraphProp,
    //otherPropertiesView?: { title: string, value: string }[],
}

export interface IGraphProp {
    label: string,
    value: string,
    isReadable: boolean,
}

export interface IShapeProps {
    id?: string,
    graphical: IShapeGraphicalProps,
    zIndex?: number,
}

export interface IShape {
    type: string,
    config: IShapeProps,
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