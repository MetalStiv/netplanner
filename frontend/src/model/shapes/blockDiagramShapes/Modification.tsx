import { IMessageShape } from "../../IMessageShape";
import IShape, { IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../../IShape";
import IShapeCreator from "../../IShapeCreator";
import { TShapeInflater } from "../../shapeInflaters";
import { ShapeType } from "../../ShapeType";

interface IModificationProps extends IShapeGraphicalProps {
    width: IGraphicalProperty,
    height: IGraphicalProperty,
    fillColorOne: IGraphicalProperty,
    strokeColor: IGraphicalProperty,
}

export interface IModificationConfig extends IShapeConfig {
    id?: string,
    graphical: IModificationProps,
    zIndex: number,
}

export const modificationInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type != ShapeType.MODIFICATION) {
        return null
    }
    return new Modification({
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

export class ModificationCreator implements IShapeCreator {
    type: ShapeType = ShapeType.MODIFICATION;
    create() {
        return new Modification({
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

class Modification implements IShape {
    type: ShapeType = ShapeType.MODIFICATION;
    config: IModificationConfig;
    isVisible: boolean = true;

    constructor(obj: IModificationConfig) {
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
                m ${(+this.config.graphical.width.value-+this.config.graphical.height.value)/2} 0
                l -${(+this.config.graphical.width.value-+this.config.graphical.height.value)/2} ${+this.config.graphical.height.value/2}
                l ${(+this.config.graphical.width.value-+this.config.graphical.height.value)/2} ${+this.config.graphical.height.value/2}
                l ${this.config.graphical.height.value} 0
                l ${(+this.config.graphical.width.value-+this.config.graphical.height.value)/2} -${+this.config.graphical.height.value/2}
                l -${(+this.config.graphical.width.value-+this.config.graphical.height.value)/2} -${+this.config.graphical.height.value/2}
                l -${this.config.graphical.height.value} 0
                `} 
            />
    }
}


export default Modification;