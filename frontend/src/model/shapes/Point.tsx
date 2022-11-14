import IShape from "./IShape";
import { ICircleProps } from "./Circle";
import Shapes from "./Shapes";

class Point implements IShape {
    elemProps: ICircleProps;

    constructor(obj: ICircleProps) {
        this.elemProps = obj;
        this.elemProps.type = Shapes.Point;
    }

    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void, handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void) {
        return <path
            id={this.elemProps.id}
            key={this.elemProps.id}
            data-type={this.elemProps.type}
            stroke={this.elemProps.stroke ?? 'black'}
            strokeWidth={this.elemProps.r ?? 2}
            fill={this.elemProps.fill ?? 'black'}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={`
        M ${this.elemProps.startCoords.x},${this.elemProps.startCoords.y + this.elemProps.r} 
        a ${this.elemProps.r},${this.elemProps.r} 0 1,1 ${this.elemProps.r * 2},0 
        a ${this.elemProps.r},${this.elemProps.r} 0 1,1 -${this.elemProps.r * 2},0
        `} />

        //<circle id={this.elemProps.id} key={this.elemProps.id} cx={this.elemProps.startCoords?.x} cy={this.elemProps.startCoords?.y} r={this.elemProps.r ?? 1} pathLength={this.elemProps.pathLength ?? 0} stroke={this.elemProps.stroke ?? 'black'} fill={this.elemProps.fill ?? 'black'} onDragStart={(e) => e.preventDefault} onMouseDown={handlerMouseDown} />;
    }
}


export default Point;