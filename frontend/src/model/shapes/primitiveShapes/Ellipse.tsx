import IShapeCreator from "../IShapeCreator";
import { ShapeType } from "../ShapeType";
import IShape, { IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { TShapeInflater } from "../shapeInflaters";
import { IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

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
        zIndex: messageShape.zIndex,
        graphicalProperties: {
            x: {
                label: "X",
                value: messageShape.graphicalProperties.x,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            y: {
                label: "Y",
                value: messageShape.graphicalProperties.y,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            pivot: {
                label: 'Pivot',
                value: '0',
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            rx: {
                label: "rx",
                value: messageShape.graphicalProperties.rx!,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            ry: {
                label: "ry",
                value: messageShape.graphicalProperties.ry!,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            strokeColor: {
                label: "Stroke Color",
                value: messageShape.graphicalProperties.strokeColor!,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            },
            fillColorOne: {
                label: "Fill Color One",
                value: messageShape.graphicalProperties.fillColorOne!,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
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
                    editorType: EditorType.TEXT_EDITOR
                },
                y: {
                    label: 'Y',
                    value: '0',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                pivot: {
                    label: 'Pivot',
                    value: '0',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                rx: {
                    label: 'Radius X',
                    value: '30',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                ry: {
                    label: 'Radius Y',
                    value: '20',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                strokeColor: {
                    label: 'Stroke Color',
                    value: '#000000',
                    isReadable: true,
                    editorType: EditorType.COLOR_EDITOR
                },
                fillColorOne: {
                    label: 'Fill Color One',
                    value: '#ffffff',
                    isReadable: true,
                    editorType: EditorType.COLOR_EDITOR
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