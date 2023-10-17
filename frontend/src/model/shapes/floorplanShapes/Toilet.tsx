import IShapeCreator from "../IShapeCreator";
import { TShapeInflater } from "../shapeInflaters";
import { ShapeType } from "../ShapeType";
import IShape, { GraphicalPropertyTypes, IGraphicalProperty, IShapeConfig, IShapeGraphicalProps, ObjectPropertyTypes } from "../IShape";
import { IMessageProperty, IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface IToiletProps extends IShapeGraphicalProps {
    [GraphicalPropertyTypes.WIDTH]: IGraphicalProperty,
    [GraphicalPropertyTypes.HEIGHT]: IGraphicalProperty,
    [GraphicalPropertyTypes.FILL_COLOR_ONE]: IGraphicalProperty,
    [GraphicalPropertyTypes.STROKE_COLOR]: IGraphicalProperty,
}

export interface IToiletConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: IToiletProps,
    zIndex: number,
}

export const toiletInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.TOILET) {
        return null
    }
    return new Toilet({
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
        },
        objectProperties: {
            [ObjectPropertyTypes.ID]: {
                value: messageShape.objectProperties ?
                    messageShape.objectProperties.find(p => p.l === ObjectPropertyTypes.ID) ?
                    messageShape.objectProperties.find(p => p.l === ObjectPropertyTypes.ID)!.v : ''
                    : '',
                editorType: EditorType.TEXT_EDITOR
            },
        },
    })
}

export class ToiletCreator implements IShapeCreator {
    type: ShapeType = ShapeType.TOILET;
    icon: string = '<path d="M 10 1 l 12 0 a 4 4 0 1 1 0 8 l -12 0 a 4 4 0 1 1 0 -8 m 1 8 l 0 8 a 3 2 0 1 0 10 0 l 0 -8'
        + ' m -3 3 l -4 0 l 0 4 a 2 2 0 1 0 4 0 l 0 -4 m -2 -8 l 1 1"'
        + ' fill="white" stroke="black" stroke-width="2"/>';
    create() {
        return new Toilet({
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
                [GraphicalPropertyTypes.HEIGHT]: {
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
            objectProperties: {
                [ObjectPropertyTypes.ID]: {
                    value: '',
                    editorType: EditorType.TEXT_EDITOR
                },
            },
            zIndex: 0,
        });
    }
}

class Toilet implements IShape {
    type: ShapeType = ShapeType.TOILET;
    config: IToiletConfig;
    isVisible: boolean = true;

    get overallWidth() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value;
    }
    set overallWidth(value: number) {
        this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value =
            this.validateProperty(value.toString(), GraphicalPropertyTypes.WIDTH);
        this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value =
            this.validateProperty(value.toString(), GraphicalPropertyTypes.HEIGHT);
    }
    get overallHeight() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value;
    }
    set overallHeight(value: number) {
        this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value =
            this.validateProperty(value.toString(), GraphicalPropertyTypes.HEIGHT);
        this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value =
            this.validateProperty(value.toString(), GraphicalPropertyTypes.WIDTH);
    }

    validateProperty(value: string, propertyType: GraphicalPropertyTypes) {
        let validValue = value;
        switch (propertyType) {
            case GraphicalPropertyTypes.WIDTH:
            case GraphicalPropertyTypes.HEIGHT:
                if (+validValue < 10) {
                    validValue = '10';
                }
                break;

            default:
                break;
        }
        return validValue;
    }

    constructor(obj: IToiletConfig) {
        this.config = obj;
        this.config.zIndex = obj.zIndex ?? 0;
    }

    updateObjectProperties(m: IMessageProperty[]) {
        this.config.objectProperties[ObjectPropertyTypes.ID] = {
            value: m.find(p => p.l === ObjectPropertyTypes.ID)!.v,
            editorType: EditorType.TEXT_EDITOR
        };
    }
    
    updateGraphicalProperties(m: IMessageProperty[]) {
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
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value / 2)})`}
            d={`
                M ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.2}
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value === '-1' 
                    ? +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value
                    : 0)}
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.4} 0
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.2},${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.2} 0 1,
                    ${(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value === '-1' ? 0: 1)} 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.4
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                l -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.4} 0  
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.2},${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.2} 0 1,
                    ${(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value === '-1' ? 0: 1)} 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.4
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}

                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.05}
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.4
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.34
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.1},${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.1} 0 1,
                    ${(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value === '-1' ? 1: 0)}
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.5} 0
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.34
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                
                m -${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.05}
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.08
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                l ${(+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.6) * -1} 0
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.28
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.1},${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.1} 0 1,
                    ${(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value === '-1' ? 1: 0)}
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.6} 0
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.28
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                

                M ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * 0.2}
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value === '-1' 
                    ? +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value
                    : 0)}
                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.29} ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.2
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                ${
                    this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value === '-1'
                        ?  `a ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.02} ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.02}
                                0 1,0 0 -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.04}
                            a ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.02} ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.02}
                                0 1,0 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.04}`
                        :  `a ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.02} ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.02}
                                0 1,1 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.04}
                            a ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.02} ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.02}
                                0 1,1 0 -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.04}`
                }
            `}
        />
    }
}

export default Toilet;