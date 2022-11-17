import IShape, { IShapeGraphicalProps, IShapeProps } from "../IShape";
import IShapeCreator from "../IShapeCreator";

interface IPolylineGraphicalProps extends IShapeGraphicalProps {
    points: Array<[number, number]>,
}

interface IPolylineProps extends IShapeProps {
    graphical: IPolylineGraphicalProps,
    pathLength?: number,
    stroke?: string,
    fill?: string,
}

export class PolylineCreator implements IShapeCreator {
    type: string = 'Polyline';
    create() {
        return new Polyline({
            graphical: {
                startCoords: {
                    x: 0,
                    y: 0
                },
                points: [[15, -30], [40, 45], [50, -70]],
            },
        });
    }
}

class Polyline implements IShape {
    type: string = 'Polyline';
    config: IPolylineProps;

    private genID = (len: number) => {
        return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(len).toString().replace('.', ''));
    }

    constructor(obj: IPolylineProps) {
        this.config = obj;
        this.config.id = `${this.type}-${this.genID(10)}`;
    }

    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void, handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void) {
        let pathStr: string = '';
        this.config.graphical.points.forEach(el => pathStr = pathStr + ' l' + el.join(' '));
        return <path
            id={this.config.id ?? ''}
            key={this.config.id ?? ''}
            data-type={this.type}
            stroke={this.config.stroke ?? 'black'}
            fill={this.config.fill ?? 'transparent'}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={`M ${this.config.graphical.startCoords.x}, ${this.config.graphical.startCoords?.y}
            ${pathStr}
            `}
        />
        //this.elemProps.points.unshift([this.elemProps.startCoords.x, this.elemProps.startCoords.y]);
        //return <polyline id={this.elemProps.id} key={this.elemProps.id} points={this.elemProps.points?.join(' ')} pathLength={this.elemProps.pathLength} stroke={this.elemProps.stroke ?? 'black'} fill={this.elemProps.fill ?? 'none'} onDragStart={(e) => e.preventDefault} onMouseDown={handlerMouseDown} />;
    }
}


export default Polyline;