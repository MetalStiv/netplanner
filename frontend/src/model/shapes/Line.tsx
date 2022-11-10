import IShape, { IShapeProps } from "./IShape";
import Shapes from "./Shapes";

interface LineProps extends IShapeProps {
    endCoords: { x: number, y: number },
    pathLength?: number,
    stroke?: string,
    fill?: string,
}

class Line implements IShape {
    elemProps: LineProps;

    constructor(obj: LineProps) {
        this.elemProps = obj;
        this.elemProps.type = Shapes.Line;
    }

    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void, handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void) {
        return <path
            id={this.elemProps.id}
            key={this.elemProps.id}
            data-type={this.elemProps.type}
            stroke={this.elemProps.stroke ?? 'black'}
            fill={this.elemProps.fill ?? 'black'}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={`
    M ${this.elemProps.startCoords.x},${this.elemProps.startCoords.y}
    l ${this.elemProps.endCoords.x},${this.elemProps.endCoords.y}
    `} />
        // <g transform={`translate(${this.elemProps.startCoords.x} ${this.elemProps.startCoords.y})`} id={this.elemProps.id} key={this.elemProps.id} stroke={this.elemProps.stroke ?? 'black'} onDragStart={(e) => e.preventDefault} onMouseDown={handlerMouseDown}>
        //     <line x1={this.elemProps.startCoords.x} y1={this.elemProps.startCoords.y} x2={this.elemProps.endCoord?.x} y2={this.elemProps.endCoord?.y} pathLength={this.elemProps.pathLength} />
        // </g>
        //);
    }
}


export default Line;