import IShapeCreator from "../IShapeCreator";
import genID from "../../../common/helpers/genID";
import { ShapeType } from "../ShapeType";
import IShape, { IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";

interface IPolylineGraphicalProps extends IShapeGraphicalProps {
    points: [number, number][],
    pathLength?: IGraphicalProperty,
    strokeColor: IGraphicalProperty,
}

interface IPolylineProps extends IShapeConfig {
    id?: string,
    graphicalProperties: IPolylineGraphicalProps,
    zIndex: number,
}

export class PolylineCreator implements IShapeCreator {
    type: ShapeType = ShapeType.POLYLINE;
    create() {
        return new Polyline({
            graphicalProperties: {
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
                pivot: {
                    label: 'Pivot',
                    value: '0',
                    isReadable: true,
                },
                points: [[15, -30], [40, 45], [50, -70]],
                strokeColor: {
                    label: 'Stroke',
                    value: '#000000',
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
        this.config.graphicalProperties.points.forEach(el => pathStr = pathStr + ' l' + el.join(' '));
        return <path
            id={this.config.id ?? ''}
            key={this.config.id ?? ''}
            data-type={this.type}
            role="shape"
            stroke={this.config.graphicalProperties.strokeColor.value ?? 'black'}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={
                `M ${this.config.graphicalProperties.x.value}, ${this.config.graphicalProperties.y.value}
                ${pathStr}`
            }
        />
    }
}


export default Polyline;