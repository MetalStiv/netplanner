import IShape, { IGraphicalProperty, IShapeGraphicalProps, IShapeConfig } from "../IShape";
import IShapeCreator from "../IShapeCreator";
import genID from "../../common/helpers/genID";
import { ShapeType } from "../ShapeType";

interface IPolylineGraphicalProps extends IShapeGraphicalProps {
    points: [number, number][],
    pathLength?: IGraphicalProperty,
    stroke?: IGraphicalProperty,
    fill?: IGraphicalProperty,
}

interface IPolylineProps extends IShapeConfig {
    graphical: IPolylineGraphicalProps,
    zIndex: number,
}

export class PolylineCreator implements IShapeCreator {
    type: ShapeType = ShapeType.POLYLINE;
    create() {
        return new Polyline({
            graphical: {
                x: {
                    label: 'X',
                    value: '0',
                    isReadable: true,
                },
                y: {
                    label: 'Y',
                    value: '0',
                    isReadable: true,
                },
                points: [[15, -30], [40, 45], [50, -70]],
                stroke: {
                    label: 'Stroke',
                    value: `#000000`,
                    isReadable: true,
                },
            },
            zIndex: 0,
        });
    }
}

class Polyline implements IShape {
    type: ShapeType = ShapeType.POLYLINE;
    config: IPolylineProps;
    isVisible: boolean = true;
    zIndex: number = 0;

    constructor(obj: IPolylineProps) {
        this.config = obj;
        this.config.id = `${this.type}-${genID(10)}`;
        this.zIndex = obj.zIndex ?? 0;
    }

    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void,
        handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void,
        layerZIndex: number) {
        let pathStr: string = '';
        this.config.graphical.points.forEach(el => pathStr = pathStr + ' l' + el.join(' '));
        return <path
            id={this.config.id ?? ''}
            key={this.config.id ?? ''}
            data-type={this.type}
            role="shape"
            stroke={this.config.graphical.stroke?.value ?? 'black'}
            fill={this.config.graphical.fill?.value ?? 'transparent'}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + layerZIndex }}
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