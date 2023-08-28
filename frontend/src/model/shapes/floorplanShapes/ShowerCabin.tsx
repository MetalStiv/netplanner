import IShapeCreator from "../IShapeCreator";
import { TShapeInflater } from "../shapeInflaters";
import { ShapeType } from "../ShapeType";
import IShape, { GraphicalPropertyTypes, IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { IMessageGraphicalProperty, IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface IShowerCabinProps extends IShapeGraphicalProps {
    [GraphicalPropertyTypes.WIDTH]: IGraphicalProperty,
    [GraphicalPropertyTypes.FILL_COLOR_ONE]: IGraphicalProperty,
    [GraphicalPropertyTypes.STROKE_COLOR]: IGraphicalProperty,
}

export interface IShowerCabinConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: IShowerCabinProps,
    zIndex: number,
}

export const showerCabinInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.SHOWER_CABIN) {
        return null
    }
    return new ShowerCabin({
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

export class ShowerCabinCreator implements IShapeCreator {
    type: ShapeType = ShapeType.SHOWER_CABIN;
    icon: string = '<path d="M 6 1 l 20 0 l 0 20 l -20 0 l 0 -20 m 16 12 l 0 -5 m -4 9 l -5 0'
        + ' m 8 0 a 1 1 0 1 0 2 0 a 1 1 0 1 0 -2 0"'
        + ' fill="white" stroke="black" stroke-width="2"/>';
    create() {
        return new ShowerCabin({
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
                    value: '80',
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

class ShowerCabin implements IShape {
    type: ShapeType = ShapeType.SHOWER_CABIN;
    config: IShowerCabinConfig;
    isVisible: boolean = true;

    get overallWidth() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value;
    }
    set overallWidth(value: number) {
        this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value =
            this.validateProperty(value.toString(), GraphicalPropertyTypes.WIDTH);
    }
    get overallHeight() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value;
    }
    set overallHeight(value: number) {
        this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value =
            this.validateProperty(value.toString(), GraphicalPropertyTypes.WIDTH);
    }

    validateProperty(value: string, propertyType: GraphicalPropertyTypes) {
        let validValue = value;
        switch (propertyType) {
            case GraphicalPropertyTypes.WIDTH:
                if (+validValue < 10) {
                    validValue = '10';
                }
                break;

            default:
                break;
        }
        return validValue;
    }

    constructor(obj: IShowerCabinConfig) {
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
            fillRule="nonzero"
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
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value / 2)})`}
            d={`
                M ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + (this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value === '-1' ?
                    +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value
                    : 0)},
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value === '-1' 
                    ? +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value
                    : 0)} 
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 0
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 0
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}

                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.1
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)},
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.1
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)} 
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.8
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 0
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.8
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.8
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 0
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.8
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}

                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.3
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)},
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.3
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.3
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)},
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.3
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)} 

                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.05
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)}, 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.05
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                l 0, ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.35
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)} 
                
                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.1
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)}, 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.45
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.35
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 0

                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.49
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 0
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.04} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.04}
                    0 1,0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.08
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)},0
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.04} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.04}
                    0 1,0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.08
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)},0
            `}
        />
    }
}

export default ShowerCabin;