import IShapeCreator from "../IShapeCreator";
import { ShapeType } from "../ShapeType";
import IShape, { IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { TShapeInflater } from "../shapeInflaters";
import { IMessageShape } from "../../message/IMessageShape";

interface IRectGraphicalProps extends IShapeGraphicalProps {
    width: IGraphicalProperty,
    height: IGraphicalProperty,
    strokeColor: IGraphicalProperty,
    fillColorOne: IGraphicalProperty
}

interface IRectConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: IRectGraphicalProps
    zIndex: number,
}

export const rectInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.RECTANGLE) {
        return null
    }
    return new Rect({
        id: messageShape.id,
        zIndex: messageShape.zIndex,
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
                label: 'Pivot',
                value: messageShape.graphicalProperties.pivot!.value,
                isReadable: true,
            },
            width: {
                label: 'Width',
                value: messageShape.graphicalProperties.width!.value,
                isReadable: true,
            },
            height: {
                label: 'Height',
                value: messageShape.graphicalProperties.height!.value,
                isReadable: true,
            },
            strokeColor: {
                label: 'Stroke Color',
                value: messageShape.graphicalProperties.strokeColor!.value,
                isReadable: true,
            },
            fillColorOne: {
                label: 'Fill Color One',
                value: messageShape.graphicalProperties.fillColorOne!.value,
                isReadable: true,
            },
        }
    })
}

export class RectCreator implements IShapeCreator {
    type: ShapeType = ShapeType.RECTANGLE;
    create() {
        return new Rect({
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
                    value: '45',
                    isReadable: true,
                },
                height: {
                    label: 'Height',
                    value: '30',
                    isReadable: true,
                },
                strokeColor: {
                    label: 'Stroke Color',
                    value: '#000000',
                    isReadable: true,
                },
                fillColorOne: {
                    label: 'Fill Color One',
                    value: '#ffffff',
                    isReadable: true,
                },
            },
            zIndex: 0,
        });
    }
}

class Rect implements IShape {
    type: ShapeType = ShapeType.RECTANGLE;
    config: IRectConfig;
    isVisible: boolean = true;
    zIndex: number = 0;

    constructor(obj: IRectConfig) {
        this.config = obj;
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
            stroke={this.config.graphicalProperties.strokeColor.value ?? 'black'}
            fill={this.config.graphicalProperties.fillColorOne.value ?? 'black'}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + +layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={
                `M${this.config.graphicalProperties.x.value} ${this.config.graphicalProperties.y.value} 
                h ${this.config.graphicalProperties.width.value ?? 15}
                v ${this.config.graphicalProperties.height.value ?? 10}
                h -${this.config.graphicalProperties.width.value ?? 15}
                Z`
            }
        />

    }
}


export default Rect;