import IShape, { IShapeGraphicalProps, IShapeProps } from "../IShape";
import IShapeCreator from "../IShapeCreator";

interface ILineGraphicalProps extends IShapeGraphicalProps {
    endCoords: { x: number, y: number },
}

interface ILineProps extends IShapeProps {
    graphical: ILineGraphicalProps,
    pathLength?: number,
    stroke?: string,
    fill?: string,
}

export class LineCreator implements IShapeCreator {
    type: string = 'Line';
    create() {
        return new Line({
            graphical: {
                startCoords: {
                    x: 0,
                    y: 0
                },
                endCoords: {
                    x: 15,
                    y: 20,
                },
            },
        });
    }
}

class Line implements IShape {
    type: string = 'Line';
    config: ILineProps;

    private genID = (len: number) => {
        return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(len).toString().replace('.', ''));
    }

    constructor(obj: ILineProps) {
        this.config = obj;
        this.config.id = `${this.type}-${this.genID(10)}`;
    }

    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void, handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void) {
        return <path
            id={this.config.id}
            key={this.config.id}
            data-type={this.type}
            stroke={this.config.stroke ?? 'black'}
            fill={this.config.fill ?? 'black'}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={
                `M ${this.config.graphical.startCoords.x},${this.config.graphical.startCoords.y}
                l ${this.config.graphical.endCoords.x},${this.config.graphical.endCoords.y}`
            } />
        // <g transform={`translate(${this.elemProps.startCoords.x} ${this.elemProps.startCoords.y})`} id={this.elemProps.id} key={this.elemProps.id} stroke={this.elemProps.stroke ?? 'black'} onDragStart={(e) => e.preventDefault} onMouseDown={handlerMouseDown}>
        //     <line x1={this.elemProps.startCoords.x} y1={this.elemProps.startCoords.y} x2={this.elemProps.endCoord?.x} y2={this.elemProps.endCoord?.y} pathLength={this.elemProps.pathLength} />
        // </g>
        //);
    }
}


export default Line;