import { IMessageShape } from "../../IMessageShape";
import IShape, { IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../../IShape";
import IShapeCreator from "../../IShapeCreator";
import { TShapeInflater } from "../../shapeInflaters";
import { ShapeType } from "../../ShapeType";

interface IInputOutputProps extends IShapeGraphicalProps {
    width: IGraphicalProperty,
    height: IGraphicalProperty,
    fillColorOne: IGraphicalProperty,
    strokeColor: IGraphicalProperty,
}

export interface IInputOutputConfig extends IShapeConfig {
    id?: string,
    graphical: IInputOutputProps,
    zIndex: number,
}

export const inputOutputInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type != ShapeType.INPUT_OUTPUT) {
        return null
    }
    return new InputOutput({
        id: messageShape.id,
        zIndex: 10,
        graphical: {
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

export class InputOutputCreator implements IShapeCreator {
    type: ShapeType = ShapeType.INPUT_OUTPUT;
    create() {
        return new InputOutput({
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
                pivot: {
                    label: 'Pivot',
                    value: '0',
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

class InputOutput implements IShape {
    type: ShapeType = ShapeType.INPUT_OUTPUT;
    config: IInputOutputConfig;
    isVisible: boolean = true;

    constructor(obj: IInputOutputConfig) {
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
            stroke={this.config.graphical.strokeColor?.value}
            fill={this.config.graphical.fillColorOne?.value}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={`
                M ${this.config.graphical.x.value},${this.config.graphical.y.value}
                m ${+this.config.graphical.height.value/4} 0
                l -${+this.config.graphical.height.value/4} ${+this.config.graphical.height.value}
                l ${+this.config.graphical.width.value-+this.config.graphical.height.value/4} 0
                l ${+this.config.graphical.height.value/4} -${+this.config.graphical.height.value}
                l -${+this.config.graphical.width.value-+this.config.graphical.height.value/4} 0
                `} 
            />
    }
}


export default InputOutput;