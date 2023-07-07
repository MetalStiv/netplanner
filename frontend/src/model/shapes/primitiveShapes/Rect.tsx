import IShapeCreator from "../IShapeCreator";
import { ShapeType } from "../ShapeType";
import IShape, { IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { TShapeInflater } from "../shapeInflaters";
import { IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

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
            width: {
                label: 'Width',
                value: messageShape.graphicalProperties.width!,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            height: {
                label: 'Height',
                value: messageShape.graphicalProperties.height!,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            strokeColor: {
                label: 'Stroke Color',
                value: messageShape.graphicalProperties.strokeColor!,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            },
            fillColorOne: {
                label: 'Fill Color One',
                value: messageShape.graphicalProperties.fillColorOne!,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
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
                width: {
                    label: 'Width',
                    value: '45',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                height: {
                    label: 'Height',
                    value: '30',
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