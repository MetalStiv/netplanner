import IShapeCreator from "../IShapeCreator";
import { TShapeInflater } from "../shapeInflaters";
import { ShapeType } from "../ShapeType";
import IShape, { GraphicalPropertyTypes, IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { IMessageGraphicalProperty, IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface IBeginEndProps extends IShapeGraphicalProps {
    [GraphicalPropertyTypes.WIDTH]: IGraphicalProperty,
    [GraphicalPropertyTypes.HEIGHT]: IGraphicalProperty,
    [GraphicalPropertyTypes.FILL_COLOR_ONE]: IGraphicalProperty,
    [GraphicalPropertyTypes.STROKE_COLOR]: IGraphicalProperty,
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
        zIndex: messageShape.zIndex,
        graphicalProperties: {
            [GraphicalPropertyTypes.X]: {
                label: "X",
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.X)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.Y]: {
                label: "Y",
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.Y)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.PIVOT]: {
                label: "Pivot",
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.PIVOT)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.WIDTH]: {
                label: "Width",
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.WIDTH)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.HEIGHT]: {
                label: "Height",
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.HEIGHT)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.FILL_COLOR_ONE]: {
                label: 'Fill Color One',
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.FILL_COLOR_ONE)!.v,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            },
            [GraphicalPropertyTypes.STROKE_COLOR]: {
                label: 'Stroke',
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.STROKE_COLOR)!.v,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            },
        }
    })
}

export class BeginEndCreator implements IShapeCreator {
    type: ShapeType = ShapeType.BEGIN_END;
    create() {
        return new BeginEnd({
            graphicalProperties: {
                [GraphicalPropertyTypes.X]: {
                    label: 'X',
                    value: '0',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.Y]: {
                    label: 'Y',
                    value: '0',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.WIDTH]: {
                    label: 'Width',
                    value: '120',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.HEIGHT]: {
                    label: 'Height',
                    value: '40',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.PIVOT]: {
                    label: 'Pivot',
                    value: '0',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },

                [GraphicalPropertyTypes.STROKE_COLOR]: {
                    label: 'Stroke Color',
                    value: '#000000',
                    isReadable: true,
                    editorType: EditorType.COLOR_EDITOR
                },

                [GraphicalPropertyTypes.FILL_COLOR_ONE]: {
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

class BeginEnd implements IShape {
    type: ShapeType = ShapeType.BEGIN_END;
    config: IBeginEndConfig;
    isVisible: boolean = true;

    constructor(obj: IBeginEndConfig) {
        this.config = obj;
        this.config.zIndex = obj.zIndex ?? 0;
    }

    updateGraphicalProperties(m: IMessageGraphicalProperty[]) {
        this.config.graphicalProperties[GraphicalPropertyTypes.X] = {
            label: 'X',
            value: m.find(p => p.l === GraphicalPropertyTypes.X)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.Y] = {
            label: 'Y',
            value: m.find(p => p.l === GraphicalPropertyTypes.Y)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH] = {
            label: 'Width',
            value: m.find(p => p.l === GraphicalPropertyTypes.WIDTH)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT] = {
            label: 'Height',
            value: m.find(p => p.l === GraphicalPropertyTypes.HEIGHT)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT] = {
            label: 'Pivot',
            value: m.find(p => p.l === GraphicalPropertyTypes.PIVOT)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.STROKE_COLOR] = {
            label: 'Stroke Color',
            value: m.find(p => p.l === GraphicalPropertyTypes.STROKE_COLOR)!.v,
            isReadable: true,
            editorType: EditorType.COLOR_EDITOR
        };

        this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE] = {
            label: 'Fill Color One',
            value: m.find(p => p.l === GraphicalPropertyTypes.FILL_COLOR_ONE)!.v,
            isReadable: true,
            editorType: EditorType.COLOR_EDITOR
        }
    }

    render(handlerMouseDown: (e: React.PointerEvent<SVGGeometryElement>) => void,
        // handlerFocus: (e: React.FocusEvent<SVGGeometryElement>) => void,
        handlerBlur: (e: React.FocusEvent<SVGGeometryElement>) => void,
        layerZIndex: number,
        isSelected: boolean
    ) {
        return <path
            className={isSelected ? 'selected' : ''}
            data-id={this.config.id}
            key={this.config.id}
            data-type={this.type}
            role="shape"
            tabIndex={-1}
            stroke={this.config.graphicalProperties[GraphicalPropertyTypes.STROKE_COLOR].value}
            fill={this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE].value}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + +layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            // onFocus={handlerFocus}
            onBlur={handlerBlur}
            transform={`rotate(${this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value} 
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value / 2)} 
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value / 2)})`}
            d={`
                M ${this.config.graphicalProperties[GraphicalPropertyTypes.X].value},${(+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value) + +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value} 
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value / 2},${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value / 2} 0 1,
                    0 0,${this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value}
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value} 0
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value / 2},${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value / 2} 0 1,
                    0 0,-${this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value}
                l -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value} 0
                `}
        />
    }
}


export default BeginEnd;