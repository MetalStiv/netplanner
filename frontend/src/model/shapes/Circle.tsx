import IShape, { IShapeProps, IShapeGraphicalProps, IGraphProp } from "../IShape";
import IShapeCreator from "../IShapeCreator";
import genID from "../../common/helpers/genID";
import { ShapeType } from "../ShapeType";
import { TShapeInflater } from "../shapeInflaters";
import { IMessageShape } from "../IMessageShape";

interface ICircleGraphicalProps extends IShapeGraphicalProps {
    //additionalGraphProps: []
    r: IGraphProp,
    fill?: IGraphProp,
    stroke?: IGraphProp,
}

export interface ICircleProps extends IShapeProps {
    //pathLength?: number,
    graphical: ICircleGraphicalProps,
    zIndex: number,
}

export const circleInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type != ShapeType.CIRCLE){
        return null
    }
    return new Circle({
        zIndex: 10,
        graphical: {
            r: {
                label: "Radius",
                value: messageShape.graphicalProperties.r!,
                isReadable: true, 
            },
            x: {
                label: "X",
                value: messageShape.graphicalProperties.x,
                isReadable: true, 
            },
            y: {
                label: "Y",
                value: messageShape.graphicalProperties.y,
                isReadable: true, 
            }
        }
    })
}

export class CircleCreator implements IShapeCreator {
    type: ShapeType = ShapeType.CIRCLE;
    create() {
        return new Circle({
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
                r: {
                    label: 'Radius',
                    value: '15',
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
                // otherPropertiesView: [{
                //     title: 'Radius',
                //     value: `${15}`
                // },
                // {
                //     title: 'Fill',
                //     value: `#000000`
                // },
                // {
                //     title: 'Stroke',
                //     value: `#000000`
                // },
                // ],
            },
            zIndex: 0,
        });
    }
}

class Circle implements IShape {
    type: ShapeType = ShapeType.CIRCLE;
    config: ICircleProps;
    isVisible: boolean = true;

    constructor(obj: ICircleProps) {
        this.config = obj;
        this.config.id = `${this.type}-${genID(10)}`;
        this.config.zIndex = obj.zIndex ?? 0;
    }

    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void, handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void, layerZIndex: number) {
        return <path
            id={this.config.id}
            key={this.config.id}
            data-type={this.type}
            role="shape"
            stroke={this.config.graphical.stroke?.value}
            fill={this.config.graphical.fill?.value}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={`
        M ${this.config.graphical.x.value},${(+this.config.graphical.y.value) + (+this.config.graphical.r.value)} 
        a ${(this.config.graphical.r.value)},${(this.config.graphical.r.value)} 0 1,1 ${(+this.config.graphical.r.value) * 2},0 
        a ${(this.config.graphical.r.value)},${(this.config.graphical.r.value)} 0 1,1 -${(+this.config.graphical.r.value) * 2},0
        `} />

        //return <circle id={this.elemProps.id} key={this.elemProps.id} cx={this.elemProps.startCoords.x + this.elemProps.r} cy={this.elemProps.startCoords.y + this.elemProps.r} r={this.elemProps.r ?? 10} pathLength={this.elemProps.pathLength} stroke={this.elemProps.stroke} fill={this.elemProps.fill} onDragStart={(e) => e.preventDefault} onMouseDown={handlerMouseDown} />;
    }
}


export default Circle;