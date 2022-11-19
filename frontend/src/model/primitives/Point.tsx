import IShape from "../IShape";
import IShapeCreator from "../IShapeCreator";
import { CircleCreator, ICircleProps, } from "./Circle";

export class PointCreator implements IShapeCreator {
    type: string = 'Point';
    create() {
        return new Point({
            graphical: {
                startCoords: {
                    x: 0,
                    y: 0
                },
                r: 2,
            },
        });
    }
}

class Point implements IShape {
    type: string = 'Point';
    config: ICircleProps;

    private genID = (len: number) => {
        return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(len).toString().replace('.', ''));
    }

    constructor(obj: ICircleProps,) {
        this.config = obj;
        this.config.id = `${this.type}-${this.genID(10)}`;
    }

    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void, 
        handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void) {
        return <path
            id={this.config.id}
            key={this.config.id}
            data-type={this.type}
            stroke={this.config.stroke ?? 'black'}
            strokeWidth={this.config.graphical.r ?? 2}
            fill={this.config.fill ?? 'black'}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={`
                M ${this.config.graphical.startCoords.x},${this.config.graphical.startCoords.y + this.config.graphical.r} 
                a ${this.config.graphical.r},${this.config.graphical.r} 0 1,1 ${this.config.graphical.r * 2},0 
                a ${this.config.graphical.r},${this.config.graphical.r} 0 1,1 -${this.config.graphical.r * 2},0
            `} />

        //<circle id={this.elemProps.id} key={this.elemProps.id} cx={this.elemProps.startCoords?.x} cy={this.elemProps.startCoords?.y} r={this.elemProps.r ?? 1} pathLength={this.elemProps.pathLength ?? 0} stroke={this.elemProps.stroke ?? 'black'} fill={this.elemProps.fill ?? 'black'} onDragStart={(e) => e.preventDefault} onMouseDown={handlerMouseDown} />;
    }
}


export default Point;