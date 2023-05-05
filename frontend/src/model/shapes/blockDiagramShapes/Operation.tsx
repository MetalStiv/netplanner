import { IMessageShape } from "../../IMessageShape";
import IShape, { IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../../IShape";
import IShapeCreator from "../../IShapeCreator";
import { TShapeInflater } from "../../shapeInflaters";
import { ShapeType } from "../../ShapeType";

interface IOperationProps extends IShapeGraphicalProps {
    width: IGraphicalProperty,
    height: IGraphicalProperty,
    fillColorOne: IGraphicalProperty,
    strokeColor: IGraphicalProperty,
}

export interface IOperationConfig extends IShapeConfig {
    id?: string,
    graphical: IOperationProps,
    zIndex: number,
}

export const operationInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type != ShapeType.OPERATION) {
        return null
    }
    return new Operation({
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

export class OperationCreator implements IShapeCreator {
    type: ShapeType = ShapeType.OPERATION;
    create() {
        return new Operation({
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

class Operation implements IShape {
    type: ShapeType = ShapeType.OPERATION;
    config: IOperationConfig;
    isVisible: boolean = true;

    constructor(obj: IOperationConfig) {
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
                l 0 ${this.config.graphical.height.value}
                l ${this.config.graphical.width.value} 0
                l 0 -${this.config.graphical.height.value}
                l -${this.config.graphical.width.value} 0
                `} 
            />
    }
}


export default Operation;