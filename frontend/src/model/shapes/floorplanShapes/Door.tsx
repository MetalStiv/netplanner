import IShapeCreator from "../IShapeCreator";
import { TShapeInflater } from "../shapeInflaters";
import { ShapeType } from "../ShapeType";
import IShape, { GraphicalPropertyTypes, IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { IMessageGraphicalProperty, IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface IDoorProps extends IShapeGraphicalProps {
    [GraphicalPropertyTypes.WIDTH]: IGraphicalProperty,
    [GraphicalPropertyTypes.HEIGHT]: IGraphicalProperty,
    [GraphicalPropertyTypes.FILL_COLOR_ONE]: IGraphicalProperty,
    [GraphicalPropertyTypes.STROKE_COLOR]: IGraphicalProperty,
}

export interface IDoorConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: IDoorProps,
    zIndex: number,
}

export const doorInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.DOOR) {
        return null
    }
    return new Door({
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
            [GraphicalPropertyTypes.MIRROR_X]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.MIRROR_X)!.v,
                isReadable: false,
                editorType: EditorType.TEXT_EDITOR,
            },
            [GraphicalPropertyTypes.MIRROR_Y]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.MIRROR_Y)!.v,
                isReadable: false,
                editorType: EditorType.TEXT_EDITOR,
            },
        }
    })
}

export class DoorCreator implements IShapeCreator {
    type: ShapeType = ShapeType.DOOR;
    create() {
        return new Door({
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
                    value: '60',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.HEIGHT]: {
                    value: '60',
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
                [GraphicalPropertyTypes.MIRROR_X]: {
                    value: '1',
                    isReadable: false,
                    editorType: EditorType.TEXT_EDITOR,
                },
                [GraphicalPropertyTypes.MIRROR_Y]: {
                    value: '1',
                    isReadable: false,
                    editorType: EditorType.TEXT_EDITOR,
                },
            },
            zIndex: 0,
        });
    }
}

class Door implements IShape {
    type: ShapeType = ShapeType.DOOR;
    config: IDoorConfig;
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

    constructor(obj: IDoorConfig) {
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

        this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.MIRROR_X)!.v,
            isReadable: false,
            editorType: EditorType.TEXT_EDITOR,
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.MIRROR_Y)!.v,
            isReadable: false,
            editorType: EditorType.TEXT_EDITOR,
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
            fillRule='nonzero'
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + +layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            // onFocus={handlerFocus}
            onBlur={handlerBlur}
            transform={`rotate(${
                this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value === this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value
                    ? +this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value
                    : 360-+this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value}

                ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value / 2)} 
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value / 2)})`}
            d={`
                M ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + (this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value === '-1'
                    ? 0
                    : +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value)},
                    ${(+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value) + (this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value === '-1' 
                    ? (+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value)
                    : 0)} 
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.05 
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value *-1
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 0
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.05 * -1
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value 
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 0

                ${
                    this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value === '1'
                        ? `l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value
                            *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                        m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -1
                            *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 
                            ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.95 *-1
                            *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                        a ${this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value} 
                            ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.95}
                            0 0 ${(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value !== 
                            this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value) ? '1' : '0'} 
                            ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value 
                            *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 
                            ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.95
                            *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                        l 0 -${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.95
                            *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}`
                        : `l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                        a ${this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value} 
                            ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.95}
                            0 0 ${(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value !== 
                            this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value) ? '0' : '1'} 
                            ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value 
                            *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 
                            ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.95
                            *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                        l 0 -${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.95
                            *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}`
                    }
            `}
        />
    }
}

export default Door;