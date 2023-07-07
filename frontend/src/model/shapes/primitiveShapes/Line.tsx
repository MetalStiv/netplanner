import IShapeCreator from "../IShapeCreator";
import { ShapeType } from "../ShapeType";
import IShape, { IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { TShapeInflater } from "../shapeInflaters";
import { IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface ILineGraphicalProps extends IShapeGraphicalProps {
    x2: IGraphicalProperty,
    y2: IGraphicalProperty,
    strokeColor: IGraphicalProperty,
}

interface ILineConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: ILineGraphicalProps,
    zIndex: number,
}

export const lineInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.LINE) {
        return null
    }
    return new Line({
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
                value: messageShape.graphicalProperties.pivot!,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            x2: {
                label: 'x2',
                value: messageShape.graphicalProperties.x2!,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            y2: {
                label: 'y2',
                value: messageShape.graphicalProperties.y2!,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            strokeColor: {
                label: 'Stroke Color',
                value: messageShape.graphicalProperties.strokeColor!,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            }
        }
    })
}

export class LineCreator implements IShapeCreator {
    type: ShapeType = ShapeType.LINE;
    create() {
        return new Line({
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
                x2: {
                    label: 'x2',
                    value: '15',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                y2: {
                    label: 'y2',
                    value: '20',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                strokeColor: {
                    label: 'Stroke Color',
                    value: '#000000',
                    isReadable: true,
                    editorType: EditorType.COLOR_EDITOR
                }
            },
            zIndex: 0,
        });
    }
}

class Line implements IShape {
    type: ShapeType = ShapeType.LINE;
    config: ILineConfig;
    isVisible: boolean = true;
    zIndex: number = 0;

    constructor(obj: ILineConfig) {
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
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + +layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={
                `M ${this.config.graphicalProperties.x.value},${this.config.graphicalProperties.y.value}
                l ${this.config.graphicalProperties.x2.value},${this.config.graphicalProperties.y2.value}`
            } />
    }
}


export default Line;