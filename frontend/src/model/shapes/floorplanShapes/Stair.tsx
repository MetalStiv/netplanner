import IShapeCreator from "../IShapeCreator";
import { TShapeInflater } from "../shapeInflaters";
import { ShapeType } from "../ShapeType";
import IShape, { GraphicalPropertyTypes, IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { IMessageGraphicalProperty, IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface IStairProps extends IShapeGraphicalProps {
    [GraphicalPropertyTypes.WIDTH]: IGraphicalProperty,
    [GraphicalPropertyTypes.HEIGHT]: IGraphicalProperty,
    [GraphicalPropertyTypes.FILL_COLOR_ONE]: IGraphicalProperty,
    [GraphicalPropertyTypes.STROKE_COLOR]: IGraphicalProperty,
    [GraphicalPropertyTypes.STEP_QUANTITY]: IGraphicalProperty,
}

export interface IStairConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: IStairProps,
    zIndex: number,
}

export const stairInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.STAIR) {
        return null
    }
    return new Stair({
        id: messageShape.id,
        zIndex: messageShape.zIndex,
        graphicalProperties: {
            [GraphicalPropertyTypes.X]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.X)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.Y]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.Y)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.PIVOT]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.PIVOT)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.WIDTH]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.WIDTH)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.HEIGHT]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.HEIGHT)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.FILL_COLOR_ONE]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.FILL_COLOR_ONE)!.v,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            },
            [GraphicalPropertyTypes.STROKE_COLOR]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.STROKE_COLOR)!.v,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            },
            [GraphicalPropertyTypes.STEP_QUANTITY]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.STEP_QUANTITY)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
        }
    })
}

export class StairCreator implements IShapeCreator {
    type: ShapeType = ShapeType.STAIR;
    create() {
        return new Stair({
            graphicalProperties: {
                [GraphicalPropertyTypes.X]: {
                    value: '0',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.Y]: {
                    value: '0',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.WIDTH]: {
                    value: '40',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.HEIGHT]: {
                    value: '140',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.PIVOT]: {
                    value: '0',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },

                [GraphicalPropertyTypes.STROKE_COLOR]: {
                    value: '#000000',
                    isReadable: true,
                    editorType: EditorType.COLOR_EDITOR
                },

                [GraphicalPropertyTypes.FILL_COLOR_ONE]: {
                    value: '#ffffff',
                    isReadable: true,
                    editorType: EditorType.COLOR_EDITOR
                },

                [GraphicalPropertyTypes.STEP_QUANTITY]: {
                    value: '10',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
            },
            zIndex: 0,
        });
    }
}

class Stair implements IShape {
    type: ShapeType = ShapeType.STAIR;
    config: IStairConfig;
    isVisible: boolean = true;

    get overallWidth() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value;
    }
    set overallWidth(value: number) {
        value > +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value &&
            (this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value = value.toString());
    }
    get overallHeight() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value;
    }
    set overallHeight(value: number) {
        value < +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value &&
            (this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value = value.toString());
    }

    constructor(obj: IStairConfig) {
        this.config = obj;
        this.config.zIndex = obj.zIndex ?? 0;
    }

    updateGraphicalProperties(m: IMessageGraphicalProperty[]) {
        this.config.graphicalProperties[GraphicalPropertyTypes.X] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.X)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.Y] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.Y)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.WIDTH)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.HEIGHT)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.PIVOT)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.STROKE_COLOR] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.STROKE_COLOR)!.v,
            isReadable: true,
            editorType: EditorType.COLOR_EDITOR
        };

        this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.FILL_COLOR_ONE)!.v,
            isReadable: true,
            editorType: EditorType.COLOR_EDITOR
        };

        this.config.graphicalProperties[GraphicalPropertyTypes.STEP_QUANTITY] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.STEP_QUANTITY)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
    }

    render(handlerMouseDown: (e: React.PointerEvent<SVGGeometryElement>) => void,
        // handlerFocus: (e: React.FocusEvent<SVGGeometryElement>) => void,
        handlerBlur: (e: React.FocusEvent<SVGGeometryElement>) => void,
        layerZIndex: number,
        isSelected: boolean,
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
            fillRule="evenodd"
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + +layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            // onFocus={handlerFocus}
            onBlur={handlerBlur}
            transform={`rotate(${this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value} 
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value / 2)} 
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value / 2)})`}
            d={`
                M ${this.config.graphicalProperties[GraphicalPropertyTypes.X].value},${this.config.graphicalProperties[GraphicalPropertyTypes.Y].value} 
                l ${this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value} 0
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.2}
                l -${this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value} 0
                l 0 -${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.2}

                m 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.2}
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.5} -${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.2}
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.5} ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.2}
                m -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.5} -${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.2}
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value}
                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.5} -${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.8}
            ` +
                Array.from({ length: +this.config.graphicalProperties[GraphicalPropertyTypes.STEP_QUANTITY].value - 1 }, (_, i) => i)
                    .map(s => `m 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.8 / (+this.config.graphicalProperties[GraphicalPropertyTypes.STEP_QUANTITY].value - 1)}
                    l 0 -${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.8 / (+this.config.graphicalProperties[GraphicalPropertyTypes.STEP_QUANTITY].value - 1)}
                    l -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value} 0
                    l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.8 / (+this.config.graphicalProperties[GraphicalPropertyTypes.STEP_QUANTITY].value - 1)}
                    l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value} 0
                `).join(' ')
            }
        />
    }
}

export default Stair;