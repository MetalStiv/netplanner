import { EditorType } from "../../EditorType";
import { IMessageShape } from "../../message/IMessageShape";
import IShape, { IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import IShapeCreator from "../IShapeCreator";
import { TShapeInflater } from "../shapeInflaters";
import { ShapeType } from "../ShapeType";

interface IProcessProps extends IShapeGraphicalProps {
    width: IGraphicalProperty,
    height: IGraphicalProperty,
    fillColorOne: IGraphicalProperty,
    strokeColor: IGraphicalProperty,
}

export interface IProcessConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: IProcessProps,
    zIndex: number,
}

export const processInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.PROCESS) {
        return null
    }
    return new Process({
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

            fillColorOne: {
                label: 'Fill Color One',
                value: messageShape.graphicalProperties.fillColorOne!,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            },
            strokeColor: {
                label: 'Stroke',
                value: messageShape.graphicalProperties.strokeColor!,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            },
            width: {
                label: "Width",
                value: messageShape.graphicalProperties.width!,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            height: {
                label: "Height",
                value: messageShape.graphicalProperties.height!,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            pivot: {
                label: "Pivot",
                value: messageShape.graphicalProperties.pivot!,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            }
        }
    })
}

export class ProcessCreator implements IShapeCreator {
    type: ShapeType = ShapeType.PROCESS;
    create() {
        return new Process({
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
                    value: '120',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                height: {
                    label: 'Height',
                    value: '80',
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
                }
            },
            zIndex: 0,
        });
    }
}

class Process implements IShape {
    type: ShapeType = ShapeType.PROCESS;
    config: IProcessConfig;
    isVisible: boolean = true;

    constructor(obj: IProcessConfig) {
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
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + +layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            transform={`rotate(${this.config.graphicalProperties.pivot.value} 
                ${+this.config.graphicalProperties.x.value + (+this.config.graphicalProperties.width.value / 2)} 
                ${+this.config.graphicalProperties.y.value + (+this.config.graphicalProperties.height.value / 2)})`}
            d={`
                M ${this.config.graphicalProperties.x.value},${this.config.graphicalProperties.y.value} 
                l 0 ${this.config.graphicalProperties.height.value}
                l ${this.config.graphicalProperties.width.value} 0
                l 0 -${this.config.graphicalProperties.height.value}
                l -${this.config.graphicalProperties.width.value} 0
                m ${+this.config.graphicalProperties.height.value * 0.15} 0
                l 0 ${this.config.graphicalProperties.height.value}
                m ${+this.config.graphicalProperties.width.value - +this.config.graphicalProperties.height.value * 0.3} 0
                l 0 -${this.config.graphicalProperties.height.value}
                `}
        />
    }
}


export default Process;