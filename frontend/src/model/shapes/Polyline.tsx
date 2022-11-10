import IShape, { IShapeProps } from "./IShape";
import Shapes from "./Shapes";

interface PolylineProps extends IShapeProps {
    points: Array<[number, number]>,
    pathLength?: number,
    stroke?: string,
    fill?: string,
}

class Polyline implements IShape {
    elemProps: PolylineProps;

    constructor(obj: PolylineProps) {
        this.elemProps = obj;
        this.elemProps.type = Shapes.Polyline;
    }

    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void, handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void) {
        let pathStr: string = '';
        this.elemProps.points.forEach(el => pathStr = pathStr + ' l' + el.join(' '))
        return <path
            id={this.elemProps.id}
            key={this.elemProps.id}
            data-type={this.elemProps.type}
            stroke={this.elemProps.stroke ?? 'black'}
            fill={this.elemProps.fill ?? 'transparent'}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={`M ${this.elemProps.startCoords.x}, ${this.elemProps.startCoords.y}
            ${pathStr}
            `}
        />
        //this.elemProps.points.unshift([this.elemProps.startCoords.x, this.elemProps.startCoords.y]);
        //return <polyline id={this.elemProps.id} key={this.elemProps.id} points={this.elemProps.points?.join(' ')} pathLength={this.elemProps.pathLength} stroke={this.elemProps.stroke ?? 'black'} fill={this.elemProps.fill ?? 'none'} onDragStart={(e) => e.preventDefault} onMouseDown={handlerMouseDown} />;
    }
}


export default Polyline;