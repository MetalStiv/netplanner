import IShape, { IGraphProp, IShapeGraphicalProps, IShapeProps } from "../IShape";
import IShapeCreator from "../IShapeCreator";
import genID from "../../common/helpers/genID";
import { ShapeType } from "../ShapeType";

interface IRectGraphicalProps extends IShapeGraphicalProps {
    //sizes: { w: number, h: number, },
    w: IGraphProp,
    h: IGraphProp,
    fill?: IGraphProp,
    stroke?: IGraphProp,
    rx?: IGraphProp,
    ry?: IGraphProp,
    pathLength?: number,
}

interface IRectProps extends IShapeProps {
    graphical: IRectGraphicalProps
    zIndex: number,
}

export class RectCreator implements IShapeCreator {
    type: ShapeType = ShapeType.RECTANGLE;
    create() {
        return new Rect({
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
                w: {
                    label: 'Width',
                    value: '45',
                    isReadable: true,
                },
                h: {
                    label: 'Height',
                    value: '30',
                    isReadable: true,
                },
                fill: {
                    label: 'Fill',
                    value: `#000000`,
                    isReadable: true,
                },
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

class Rect implements IShape {
    type: ShapeType = ShapeType.RECTANGLE;
    config: IRectProps;
    isVisible: boolean = true;
    zIndex: number = 0;

    constructor(obj: IRectProps) {
        this.config = obj;
        this.config.id = `${this.type}-${genID(10)}`;
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
            fill={this.config.graphical.fill?.value ?? 'black'}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={
                `M${this.config.graphical.x.value} ${this.config.graphical.y.value} 
                h ${this.config.graphical.w.value ?? 15}
                v ${this.config.graphical.h.value ?? 10}
                h -${this.config.graphical.w.value ?? 15}
                Z`
            }
        />
        //return <rect id={this.elemProps.id} key={this.elemProps.id} x={this.elemProps.startCoords?.x} y={this.elemProps.startCoords?.y} width={this.elemProps.sizes?.w ?? 15} height={this.elemProps.sizes?.h ?? 10} rx={this.elemProps.rDif?.rx ?? 0} ry={this.elemProps.rDif?.ry ?? 0} pathLength={this.elemProps.pathLength ?? ''} stroke={this.elemProps.stroke ?? 'black'} fill={this.elemProps.fill ?? 'black'} onDragStart={(e) => e.preventDefault} onMouseDown={handlerMouseDown} />;
    }
}


export default Rect;