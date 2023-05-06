import { IMessageShape } from "../../message/IMessageShape";
import IShape, { IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import IShapeCreator from "../IShapeCreator";
import { TShapeInflater } from "../shapeInflaters";
import { ShapeType } from "../ShapeType";

interface IRepeatProps extends IShapeGraphicalProps {
    width: IGraphicalProperty,
    height: IGraphicalProperty,
    fillColorOne: IGraphicalProperty,
    strokeColor: IGraphicalProperty,
}

export interface IRepeatConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: IRepeatProps,
    zIndex: number,
}

export const repeatInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.REPEAT) {
        return null
    }
    return new Repeat({
        id: messageShape.id,
        zIndex: 10,
        graphicalProperties: {
            x: {
                label: "X",
                value: messageShape.graphicalProperties.x.value,
                isReadable: true,
            },
            y: {
                label: "Y",
                value: messageShape.graphicalProperties.y.value,
                isReadable: true,
            },

            fillColorOne: {
                label: 'Fill Color One',
                value: messageShape.graphicalProperties.fillColorOne!.value,
                isReadable: true,
            },
            strokeColor: {
                label: 'Stroke',
                value: messageShape.graphicalProperties.strokeColor!.value,
                isReadable: true,
            },
            width: {
                label: "Width",
                value: messageShape.graphicalProperties.width!.value,
                isReadable: true,
            },
            height: {
                label: "Height",
                value: messageShape.graphicalProperties.height!.value,
                isReadable: true,
            },
            pivot: {
                label: "Pivot",
                value: messageShape.graphicalProperties.pivot!.value,
                isReadable: true,
            }
        }
    })
}

export class RepeatCreator implements IShapeCreator {
    type: ShapeType = ShapeType.REPEAT;
    create() {
        return new Repeat({
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
                width: {
                    label: 'Width',
                    value: '120',
                    isReadable: true,
                },
                height: {
                    label: 'Height',
                    value: '80',
                    isReadable: true,
                },
                strokeColor: {
                    label: 'Stroke Color',
                    value: '#000000',
                    isReadable: true
                },

                fillColorOne: {
                    label: 'Fill Color One',
                    value: '#ffffff',
                    isReadable: true
                }
            },
            zIndex: 0,
        });
    }
}

class Repeat implements IShape {
    type: ShapeType = ShapeType.REPEAT;
    config: IRepeatConfig;
    isVisible: boolean = true;

    constructor(obj: IRepeatConfig) {
        this.config = obj;
        this.config.zIndex = obj.zIndex ?? 0;
    }

    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void, 
        handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void, 
        layerZIndex: number) {
        return <path
            id={this.config.id}
            key={this.config.id}
            data-type={this.type}
            role="shape"
            stroke={this.config.graphicalProperties.strokeColor?.value}
            fill={this.config.graphicalProperties.fillColorOne?.value}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={`
                M ${this.config.graphicalProperties.x.value},${this.config.graphicalProperties.y.value}
                m ${+this.config.graphicalProperties.height.value/4} 0 
                l -${+this.config.graphicalProperties.height.value/4} ${+this.config.graphicalProperties.height.value/4}
                l 0 ${+this.config.graphicalProperties.height.value*0.75}
                l ${this.config.graphicalProperties.width.value} 0
                l 0 -${+this.config.graphicalProperties.height.value*0.75}
                l -${+this.config.graphicalProperties.height.value/4} -${+this.config.graphicalProperties.height.value/4}
                l -${+this.config.graphicalProperties.width.value-+this.config.graphicalProperties.height.value/2} 0
                `} 
            />
    }
}


export default Repeat;