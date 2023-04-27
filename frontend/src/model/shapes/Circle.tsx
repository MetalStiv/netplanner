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
    id?: string,
    graphical: ICircleGraphicalProps,
    zIndex: number,
}

export const circleInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type != ShapeType.CIRCLE){
        return null
    }
    const x = messageShape.graphicalProperties.find(p => p.label === "X")!.value;
    const y = messageShape.graphicalProperties.find(p => p.label === "Y")!.value;
    return new Circle({
        id: messageShape.id,
        zIndex: 10,
        graphical: {
            r: {
                label: "Radius",
                value: "20", //messageShape.graphicalProperties.find(p => p.label === "Radius")!.value,
                isReadable: true //messageShape.graphicalProperties.find(p => p.label === "Radius")!.isReadable, 
            },
            x: {
                label: "X",
                value: x,
                isReadable: true, 
            },
            y: {
                label: "Y",
                value: y,
                isReadable: true, 
            },
            // fill: {
            //     label: 'Fill',
            //     value: messageShape.graphicalProperties.find(p => p.label === "Fill")!.value,
            //     isReadable: messageShape.graphicalProperties.find(p => p.label === "Fill")!.isReadable,
            // },
            // stroke: {
            //     label: 'Stroke',
            //     value: messageShape.graphicalProperties.find(p => p.label === "Stroke")!.value,
            //     isReadable: messageShape.graphicalProperties.find(p => p.label === "Stroke")!.isReadable,
            // }
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
                }
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
    }
}


export default Circle;