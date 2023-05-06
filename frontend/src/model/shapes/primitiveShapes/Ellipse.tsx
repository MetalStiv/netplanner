import IShapeCreator from "../IShapeCreator";
import genID from "../../../common/helpers/genID";
import { ShapeType } from "../ShapeType";
import IShape, { IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { TShapeInflater } from "../shapeInflaters";
import { IMessageShape } from "../../message/IMessageShape";

interface IEllipseGraphicalProps extends IShapeGraphicalProps {
    strokeColor: IGraphicalProperty,
    fillColorOne: IGraphicalProperty,
    rx: IGraphicalProperty,
    ry: IGraphicalProperty,
}

interface IEllipseConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: IEllipseGraphicalProps,
    zIndex: number,
}

export const ellipseInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.ELLIPS) {
        return null
    }
    return new Ellipse({
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
                label: 'Pivot',
                value: '0',
                isReadable: true,
            },
            rx: {
                label: "rx",
                value: messageShape.graphicalProperties.rx!.value,
                isReadable: true 
            },
            ry: {
                label: "ry",
                value: messageShape.graphicalProperties.ry!.value,
                isReadable: true 
            },
            strokeColor: {
                label: "Stroke Color",
                value: messageShape.graphicalProperties.strokeColor!.value,
                isReadable: true 
            },
            fillColorOne: {
                label: "Fill Color One",
                value: messageShape.graphicalProperties.fillColorOne!.value,
                isReadable: true 
            },
        }
    })
}

export class EllipseCreator implements IShapeCreator {
    type: ShapeType = ShapeType.ELLIPS;
    create() {
        return new Ellipse({
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
            stroke={this.config.graphicalProperties.strokeColor.value ?? 'black'}
            fill={this.config.graphicalProperties.fillColorOne.value ?? 'black'}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={`
                M ${(+this.config.graphicalProperties.x.value) +
                (+this.config.graphicalProperties.rx.value)},${this.config.graphicalProperties.y.value}
                a ${this.config.graphicalProperties.rx.value},${this.config.graphicalProperties.ry.value}
                0
                1,0
                1,0
                z
            `}
        />
    }
}


export default Ellipse;