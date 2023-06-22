import IShapeCreator from "../IShapeCreator";
import { TShapeInflater } from "../shapeInflaters";
import { ShapeType } from "../ShapeType";
import IShape, { IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface IDecisionProps extends IShapeGraphicalProps {
    width: IGraphicalProperty,
    height: IGraphicalProperty,
    fillColorOne: IGraphicalProperty,
    strokeColor: IGraphicalProperty,
}

export interface IDecisionConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: IDecisionProps,
    zIndex: number,
}

export const decisionInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.DECISION) {
        return null
    }
    return new Decision({
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
                label: "Pivot",
                value: messageShape.graphicalProperties.pivot!.value,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            width: {
                label: "Width",
                value: messageShape.graphicalProperties.width!.value,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            height: {
                label: "Height",
                value: messageShape.graphicalProperties.height!.value,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            fillColorOne: {
                label: 'Fill Color One',
                value: messageShape.graphicalProperties.fillColorOne!.value,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            },
            strokeColor: {
                label: 'Stroke',
                value: messageShape.graphicalProperties.strokeColor!.value,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            }
        }
    })
}

export class DecisionCreator implements IShapeCreator {
    type: ShapeType = ShapeType.DECISION;
    create() {
        return new Decision({
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
                pivot: {
                    label: 'Pivot',
                    value: '0',
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

class Decision implements IShape {
    type: ShapeType = ShapeType.DECISION;
    config: IDecisionConfig;
    isVisible: boolean = true;

    constructor(obj: IDecisionConfig) {
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
                M ${+this.config.graphicalProperties.x.value + +this.config.graphicalProperties.width.value / 2},
                    ${this.config.graphicalProperties.y.value} 
                l -${+this.config.graphicalProperties.width.value / 2} ${+this.config.graphicalProperties.height.value / 2}
                l ${+this.config.graphicalProperties.width.value / 2} ${+this.config.graphicalProperties.height.value / 2}
                l ${+this.config.graphicalProperties.width.value / 2} -${+this.config.graphicalProperties.height.value / 2}
                l -${+this.config.graphicalProperties.width.value / 2} -${+this.config.graphicalProperties.height.value / 2}
                `}
        />
    }
}


export default Decision;