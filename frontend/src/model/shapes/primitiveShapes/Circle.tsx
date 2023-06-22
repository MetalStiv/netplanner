import IShapeCreator from "../IShapeCreator";
import { ShapeType } from "../ShapeType";
import { TShapeInflater } from "../shapeInflaters";
import IShape, { IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface ICircleGraphicalProps extends IShapeGraphicalProps {
    r: IGraphicalProperty,
    strokeColor: IGraphicalProperty,
    fillColorOne: IGraphicalProperty,
}

export interface ICircleConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: ICircleGraphicalProps,
    zIndex: number,
}

export const circleInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.CIRCLE) {
        return null
    }
    return new Circle({
        id: messageShape.id,
        zIndex: messageShape.zIndex,
        graphicalProperties: {
            x: {
                label: "X",
                value: messageShape.graphicalProperties.x.value,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            y: {
                label: "Y",
                value: messageShape.graphicalProperties.y.value,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            pivot: {
                label: 'Pivot',
                value: '0',
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            r: {
                label: "Radius",
                value: messageShape.graphicalProperties.r!.value,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            strokeColor: {
                label: "Stroke Color",
                value: messageShape.graphicalProperties.strokeColor!.value,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            },
            fillColorOne: {
                label: "Fill Color One",
                value: messageShape.graphicalProperties.fillColorOne!.value,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            },
        }
    })
}

export class CircleCreator implements IShapeCreator {
    type: ShapeType = ShapeType.CIRCLE;
    create() {
        return new Circle({
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
                r: {
                    label: 'Radius',
                    value: '15',
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

class Circle implements IShape {
    type: ShapeType = ShapeType.CIRCLE;
    config: ICircleConfig;
    isVisible: boolean = true;

    constructor(obj: ICircleConfig) {
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
            stroke={this.config.graphicalProperties.strokeColor.value}
            fill={this.config.graphicalProperties.fillColorOne.value}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + +layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            transform={`rotate(${this.config.graphicalProperties.pivot.value} 
                ${+this.config.graphicalProperties.x.value + (+this.config.graphicalProperties.r.value / 2)} 
                ${+this.config.graphicalProperties.y.value + (+this.config.graphicalProperties.r.value / 2)})`}
            d={`
                M ${this.config.graphicalProperties.x.value},${(+this.config.graphicalProperties.y.value) + (+this.config.graphicalProperties.r.value)} 
                a ${(this.config.graphicalProperties.r.value)},${(this.config.graphicalProperties.r.value)} 0 1,
                    1 ${(+this.config.graphicalProperties.r.value) * 2},0 
                a ${(this.config.graphicalProperties.r.value)},${(this.config.graphicalProperties.r.value)} 0 1,
                    1 -${(+this.config.graphicalProperties.r.value) * 2},0
            `} />
    }
}


export default Circle;