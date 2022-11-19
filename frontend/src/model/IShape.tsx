export interface IShapeGraphicalProps {
    startCoords: { x: number, y: number }
}

export interface IShapeProps {
    id?: string,
    graphical: IShapeGraphicalProps
}

export interface IShape {
    type: string,
    config: IShapeProps,
    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void, 
        handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void): JSX.Element;
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