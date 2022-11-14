import IShape, { IShapeProps } from "./IShape";
import Shapes from "./Shapes";

export interface ICircleProps extends IShapeProps {
    r: number
    stroke?: string,
    fill?: string,
    pathLength?: number,
}

class Circle implements IShape {
    elemProps: ICircleProps;

    constructor(obj: ICircleProps) {
        this.elemProps = obj;
        this.elemProps.type = Shapes.Circle;
    }

    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void, handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void) {
        return <path
            id={this.elemProps.id}
            key={this.elemProps.id}
            data-type={this.elemProps.type}
            stroke={this.elemProps.stroke}
            fill={this.elemProps.fill}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={`
        M ${this.elemProps.startCoords.x},${this.elemProps.startCoords.y + this.elemProps.r} 
        a ${this.elemProps.r},${this.elemProps.r} 0 1,1 ${this.elemProps.r * 2},0 
        a ${this.elemProps.r},${this.elemProps.r} 0 1,1 -${this.elemProps.r * 2},0
        `} />

        //return <circle id={this.elemProps.id} key={this.elemProps.id} cx={this.elemProps.startCoords.x + this.elemProps.r} cy={this.elemProps.startCoords.y + this.elemProps.r} r={this.elemProps.r ?? 10} pathLength={this.elemProps.pathLength} stroke={this.elemProps.stroke} fill={this.elemProps.fill} onDragStart={(e) => e.preventDefault} onMouseDown={handlerMouseDown} />;
    }
}


export default Circle;