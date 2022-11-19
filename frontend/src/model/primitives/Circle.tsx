import IShape, { IShapeProps, IShapeGraphicalProps } from "../IShape";
import IShapeCreator from "../IShapeCreator";

interface ICircleGraphicalProps extends IShapeGraphicalProps {
    r: number,
}

export interface ICircleProps extends IShapeProps {
    stroke?: string,
    fill?: string,
    pathLength?: number,
    graphical: ICircleGraphicalProps,
}

export class CircleCreator implements IShapeCreator {
    type: string = 'Circle';
    create() {
        return new Circle({
            graphical: {
                startCoords: {
                    x: 0,
                    y: 0,
                },
                r: 15,
            },
        });
    }
}

class Circle implements IShape {
    type: string = 'Circle';
    config: ICircleProps;

    private genID = (len: number) => {
        return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(len).toString().replace('.', ''));
    }

    constructor(obj: ICircleProps) {
        this.config = obj;
        this.config.id = `${this.type}-${this.genID(10)}`;
    }

    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void, handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void) {
        return <path
            id={this.config.id}
            key={this.config.id}
            data-type={this.type}
            stroke={this.config.stroke}
            fill={this.config.fill}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={`
        M ${this.config.graphical.startCoords.x},${this.config.graphical.startCoords.y + this.config.graphical.r} 
        a ${this.config.graphical.r},${this.config.graphical.r} 0 1,1 ${this.config.graphical.r * 2},0 
        a ${this.config.graphical.r},${this.config.graphical.r} 0 1,1 -${this.config.graphical.r * 2},0
        `} />

        //return <circle id={this.elemProps.id} key={this.elemProps.id} cx={this.elemProps.startCoords.x + this.elemProps.r} cy={this.elemProps.startCoords.y + this.elemProps.r} r={this.elemProps.r ?? 10} pathLength={this.elemProps.pathLength} stroke={this.elemProps.stroke} fill={this.elemProps.fill} onDragStart={(e) => e.preventDefault} onMouseDown={handlerMouseDown} />;
    }
}


export default Circle;