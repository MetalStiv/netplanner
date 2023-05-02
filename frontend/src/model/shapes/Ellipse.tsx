import IShape, { IGraphicalProperty, IShapeGraphicalProps, IShapeConfig } from "../IShape";
import IShapeCreator from "../IShapeCreator";
import genID from "../../common/helpers/genID";
import { ShapeType } from "../ShapeType";

interface IEllipseGraphicalProps extends IShapeGraphicalProps {
    stroke?: IGraphicalProperty,
    fill?: IGraphicalProperty,
    rx: IGraphicalProperty,
    ry: IGraphicalProperty,
}

interface IEllipseConfig extends IShapeConfig {
    graphical: IEllipseGraphicalProps,
    zIndex: number,
}

export class EllipseCreator implements IShapeCreator {
    type: ShapeType = ShapeType.ELLIPS;
    create() {
        return new Ellipse({
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
                rx: {
                    label: 'Radius X',
                    value: '30',
                    isReadable: true,
                },
                ry: {
                    label: 'Radius Y',
                    value: '20',
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

class Ellipse implements IShape {
    type: ShapeType = ShapeType.ELLIPS;
    config: IEllipseConfig;
    isVisible: boolean = true;
    zIndex: number = 0;

    constructor(obj: IEllipseConfig) {
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
            d={`
                M ${(+this.config.graphical.x.value) +
                (+this.config.graphical.rx.value)},${this.config.graphical.y.value}
                a ${this.config.graphical.rx.value},${this.config.graphical.ry.value}
                0
                1,0
                1,0
                z
            `}
        />
        // M - левая координата
        // первая в а - размеры по x,y
        // угол поворота
        // флаги
        // последняя - правая координата


        //return <ellipse id={this.elemProps.id} key={this.elemProps.id} cx={this.elemProps.startCoords.x + this.elemProps.rDif.rx} cy={this.elemProps.startCoords.y + this.elemProps.rDif.ry} r={this.elemProps.r ?? 10} rx={this.elemProps.rDif?.rx ?? 0} ry={this.elemProps.rDif?.ry ?? 0} pathLength={this.elemProps.pathLength} stroke={this.elemProps.stroke ?? 'black'} fill={this.elemProps.fill ?? 'black'} onDragStart={(e) => e.preventDefault} onMouseDown={handlerMouseDown} />;
    }
}


export default Ellipse;