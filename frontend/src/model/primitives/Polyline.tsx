import IShape, { IGraphProp, IShapeGraphicalProps, IShapeProps } from "../IShape";
import IShapeCreator from "../IShapeCreator";

interface IPolylineGraphicalProps extends IShapeGraphicalProps {
    points: [number, number][],
    pathLength?: IGraphProp,
    stroke?: IGraphProp,
    fill?: IGraphProp,
}

interface IPolylineProps extends IShapeProps {
    graphical: IPolylineGraphicalProps,
    zIndex?: number,
}

export class PolylineCreator implements IShapeCreator {
    type: string = 'Polyline';
    create() {
        return new Polyline({
            graphical: {
                x: {
                    label: 'X',
                    value: '0',
                    isReadable: false,
                },
                y: {
                    label: 'Y',
                    value: '0',
                    isReadable: false,
                },
                points: [[15, -30], [40, 45], [50, -70]],
                stroke: {
                    label: 'Stroke',
                    value: `#000000`,
                    isReadable: true,
                },
            },
        });
    }
}

class Polyline implements IShape {
    type: string = 'Polyline';
    config: IPolylineProps;
    isVisible: boolean = true;
    zIndex: number = 0;

    private genID = (len: number) => {
        return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(len).toString().replace('.', ''));
    }

    constructor(obj: IPolylineProps) {
        this.config = obj;
        this.config.id = `${this.type}-${this.genID(10)}`;
        this.zIndex = obj.zIndex ?? 0;
    }

    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void,
        handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void) {
        let pathStr: string = '';
        this.config.graphical.points.forEach(el => pathStr = pathStr + ' l' + el.join(' '));
        return <path
            id={this.config.id ?? ''}
            key={this.config.id ?? ''}
            data-type={this.type}
            stroke={this.config.graphical.stroke?.value ?? 'black'}
            fill={this.config.graphical.fill?.value ?? 'transparent'}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={
                `M ${this.config.graphical.x.value}, ${this.config.graphical.y.value}
                ${pathStr}`
            }
        />
        //this.elemProps.points.unshift([this.elemProps.startCoords.x, this.elemProps.startCoords.y]);
        //return <polyline id={this.elemProps.id} key={this.elemProps.id} points={this.elemProps.points?.join(' ')} pathLength={this.elemProps.pathLength} stroke={this.elemProps.stroke ?? 'black'} fill={this.elemProps.fill ?? 'none'} onDragStart={(e) => e.preventDefault} onMouseDown={handlerMouseDown} />;
    }
}


export default Polyline;