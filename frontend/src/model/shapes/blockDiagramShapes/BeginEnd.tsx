import IShapeCreator from "../IShapeCreator";
import { TShapeInflater } from "../shapeInflaters";
import { ShapeType } from "../ShapeType";
import IShape, { IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { IMessageShape } from "../../message/IMessageShape";

interface IBeginEndProps extends IShapeGraphicalProps {
    width: IGraphicalProperty,
    height: IGraphicalProperty,
    fillColorOne: IGraphicalProperty,
    strokeColor: IGraphicalProperty,
}

export interface IBeginEndConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: IBeginEndProps,
    zIndex: number,
}

export const beginEndInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.BEGIN_END) {
        return null
    }
    return new BeginEnd({
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
            pivot: {
                label: "Pivot",
                value: messageShape.graphicalProperties.pivot!.value,
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
        }
    })
}

export class BeginEndCreator implements IShapeCreator {
    type: ShapeType = ShapeType.BEGIN_END;
    create() {
        return new BeginEnd({
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
                width: {
                    label: 'Width',
                    value: '120',
                    isReadable: true,
                },
                height: {
                    label: 'Height',
                    value: '40',
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

class BeginEnd implements IShape {
    type: ShapeType = ShapeType.BEGIN_END;
    config: IBeginEndConfig;
    isVisible: boolean = true;

    constructor(obj: IBeginEndConfig) {
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
                M ${this.config.graphicalProperties.x.value},${(+this.config.graphicalProperties.y.value) + +this.config.graphicalProperties.height.value} 
                a ${+this.config.graphicalProperties.height.value/2},${+this.config.graphicalProperties.height.value/2} 0 1,
                    0 0,${this.config.graphicalProperties.height.value}
                l ${+this.config.graphicalProperties.width.value-+this.config.graphicalProperties.height.value} 0
                a ${+this.config.graphicalProperties.height.value/2},${+this.config.graphicalProperties.height.value/2} 0 1,
                    0 0,-${this.config.graphicalProperties.height.value}
                l -${+this.config.graphicalProperties.width.value-+this.config.graphicalProperties.height.value} 0
                `} 
            />
    }
}


export default BeginEnd;