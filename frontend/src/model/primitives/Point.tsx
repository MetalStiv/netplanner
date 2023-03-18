import IShape from "../IShape";
import IShapeCreator from "../IShapeCreator";
import { CircleCreator, ICircleProps, } from "./Circle";

export class PointCreator implements IShapeCreator {
    type: string = 'Point';
    create() {
        return new Point({
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
                r: {
                    label: 'Radius',
                    value: '2',
                    isReadable: true,
                },
                fill: {
                    label: 'Fill',
                    value: `#000000`,
                    isReadable: true,
                },
            },
            zIndex: 0,
        });
    }
}

class Point implements IShape {
    type: string = 'Point';
    config: ICircleProps;
    isVisible: boolean = true;
    zIndex: number = 0;

    private genID = (len: number) => {
        return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(len).toString().replace('.', ''));
    }

    constructor(obj: ICircleProps) {
        this.config = obj;
        this.config.id = `${this.type}-${this.genID(10)}`;
        this.zIndex = obj.zIndex ?? 0;
    }

    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void,
        handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void,
        layerZIndex: number) {
        return <path
            id={this.config.id}
            key={this.config.id}
            data-type={this.type}
            role="shape"
            stroke={this.config.graphical.stroke?.value ?? 'black'}
            strokeWidth={this.config.graphical.r.value ?? 2}
            fill={this.config.graphical.fill?.value ?? 'black'}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={`
                M ${this.config.graphical.x.value},${((+this.config.graphical.y.value) + (+this.config.graphical.r.value))} 
                a ${this.config.graphical.r.value},${this.config.graphical.r.value} 0 1,1 ${(+this.config.graphical.r.value) * 2},0 
                a ${this.config.graphical.r.value},${this.config.graphical.r.value} 0 1,1 -${(+this.config.graphical.r.value) * 2},0
            `} />

        //<circle id={this.elemProps.id} key={this.elemProps.id} cx={this.elemProps.startCoords?.x} cy={this.elemProps.startCoords?.y} r={this.elemProps.r ?? 1} pathLength={this.elemProps.pathLength ?? 0} stroke={this.elemProps.stroke ?? 'black'} fill={this.elemProps.fill ?? 'black'} onDragStart={(e) => e.preventDefault} onMouseDown={handlerMouseDown} />;
    }
}


export default Point;