import IShape from "../../IShape";
import IShapeCreator from "../../IShapeCreator";
import { CircleCreator, ICircleConfig } from "./Circle";
import genID from "../../../common/helpers/genID";
import { ShapeType } from "../../ShapeType";

export class PointCreator implements IShapeCreator {
    type: ShapeType = ShapeType.POINT;
    create() {
        return new Point({
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
                pivot: {
                    label: 'Pivot',
                    value: '0',
                    isReadable: true,
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
    type: ShapeType = ShapeType.POINT;
    config: ICircleConfig;
    isVisible: boolean = true;
    zIndex: number = 0;

    constructor(obj: ICircleConfig) {
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