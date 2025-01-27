import IShapeCreator from "../IShapeCreator";
import { TShapeInflater } from "../shapeInflaters";
import { ShapeType } from "../ShapeType";
import IShape, { GraphicalPropertyTypes, IGraphicalProperty, IShapeConfig, IShapeGraphicalProps, ObjectPropertyTypes } from "../IShape";
import { IMessageProperty, IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface IUrinalProps extends IShapeGraphicalProps {
    [GraphicalPropertyTypes.WIDTH]: IGraphicalProperty,
    [GraphicalPropertyTypes.FILL_COLOR_ONE]: IGraphicalProperty,
    [GraphicalPropertyTypes.STROKE_COLOR]: IGraphicalProperty,
}

export interface IUrinalConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: IUrinalProps,
    zIndex: number,
}

export const urinalInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.URINAL) {
        return null
    }
    return new Urinal({
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
        connectionPoints: null
    })
}

export class UrinalCreator implements IShapeCreator {
    type: ShapeType = ShapeType.URINAL;
    icon: string = '<path d="M 6 1 l 20 0 l -4 16 c -2 4 -10 4 -12 0 l -4 -16'
        + ' m 4 4 l 12 0 l -3 10 c -1 2 -4 2 -6 0 l -3 -10'
        + ' m 5 6 l 2 1"'
        + ' fill="white" stroke="black" stroke-width="2"/>';
    create() {
        return new Urinal({
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
            connectionPoints: null
        });
    }
}

class Urinal implements IShape {
    type: ShapeType = ShapeType.URINAL;
    config: IUrinalConfig;
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

    constructor(obj: IUrinalConfig) {
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
            stroke={this.config.graphicalProperties[GraphicalPropertyTypes.STROKE_COLOR].value.toString()}
            fill={this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE].value.toString()}
            fillRule="nonzero"
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + +layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onBlur={handlerBlur}
            transform={`rotate(${this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value === this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value
                    ? +this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value
                    : 360 - +this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value}
                    
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
                * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 0
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -0.15 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.7 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                c ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -0.15 / 2 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.7 / 2 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -0.6 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.7 / 2 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -0.7 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 0
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -0.15 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -0.7 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.15 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.2 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.7 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 0
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -0.15 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.6 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                c ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -0.15 / 8 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.7 / 8 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 1.1 / -4 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.7 / 4 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -0.4 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 0
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -0.15 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -0.6 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.35 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.4 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.01} ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.01} 0 0 1
                    0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.1 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.01} ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.01} 0 0 1
                    0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -0.1 * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
            `}
        />
    }
}

export default Urinal;