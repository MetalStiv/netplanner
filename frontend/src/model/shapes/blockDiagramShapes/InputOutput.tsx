import IShapeCreator from "../IShapeCreator";
import { TShapeInflater } from "../shapeInflaters";
import { ShapeType } from "../ShapeType";
import IShape, { GraphicalPropertyTypes, IGraphicalProperty, IShapeConfig, IShapeGraphicalProps, ObjectPropertyTypes } from "../IShape";
import { IMessageProperty, IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";
import IConnectionPoint, { ConnectionPointTypes, calculateCPCoords, connectionPointsInflaters } from "../IConnectionPoint";

interface IInputOutputProps extends IShapeGraphicalProps {
    [GraphicalPropertyTypes.WIDTH]: IGraphicalProperty,
    [GraphicalPropertyTypes.HEIGHT]: IGraphicalProperty,
    [GraphicalPropertyTypes.FILL_COLOR_ONE]: IGraphicalProperty,
    [GraphicalPropertyTypes.STROKE_COLOR]: IGraphicalProperty,
}

export interface IInputOutputConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: IInputOutputProps,
    zIndex: number,
}

export const inputOutputInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.INPUT_OUTPUT) {
        return null
    }
    return new InputOutput({
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
        connectionPoints: (() => {
            const w = +messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.WIDTH)!.v;
            const h = +messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.HEIGHT)!.v;

            return messageShape?.connectionPoints.map(point => connectionPointsInflaters.inflate(point, w, h)!)
                ?? [ConnectionPointTypes.TOP, ConnectionPointTypes.BOTTOM].map(type => {
                    const { relativeCoords, markerOffset } = calculateCPCoords(type, w, h);
                    return ({
                        id: '',
                        type,
                        relativeCoords,
                        markerOffset,
                        connectionAreaRadius: 10,
                        connectedShapes: null
                    });
                })
        })()
    })
}

export class InputOutputCreator implements IShapeCreator {
    type: ShapeType = ShapeType.INPUT_OUTPUT;
    icon: string = '<path d="M 5 4 l -4 16 l 20 0 l 4 -16 l -20 0"'
        + ' fill="white" stroke="black" stroke-width="2"/>';
    create() {
        return new InputOutput({
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
                    value: '120',
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
            connectionPoints: [ConnectionPointTypes.TOP, ConnectionPointTypes.BOTTOM]
                .map(type => {
                    const { relativeCoords, markerOffset } = calculateCPCoords(type, 120, 80);
                    return ({
                        id: '',
                        type,
                        relativeCoords,
                        markerOffset,
                        connectionAreaRadius: 10,
                        connectedShapes: null
                    });
                })
        });
    }
}

class InputOutput implements IShape {
    type: ShapeType = ShapeType.INPUT_OUTPUT;
    config: IInputOutputConfig;
    isVisible: boolean = true;

    get overallWidth() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value;
    }
    set overallWidth(value: number) {
        const newWidth = this.validateProperty(value.toString(), GraphicalPropertyTypes.WIDTH);
        this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value = newWidth;
        if (this.config.connectionPoints?.length) {
            this.config.connectionPoints =
                this.config.connectionPoints.map(p => ({ ...p, relativeCoords: calculateCPCoords(p.type, +newWidth, this.overallHeight).relativeCoords }));
        }
    }
    get overallHeight() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value;
    }
    set overallHeight(value: number) {
        const newHeight = this.validateProperty(value.toString(), GraphicalPropertyTypes.HEIGHT);
        this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value = newHeight;
        if (this.config.connectionPoints?.length) {
            this.config.connectionPoints =
                this.config.connectionPoints.map(p => ({ ...p, relativeCoords: calculateCPCoords(p.type, this.overallWidth, +newHeight).relativeCoords }));
        }
    }

    validateProperty(value: string, propertyType: GraphicalPropertyTypes) {
        let validValue = value;
        switch (propertyType) {
            case GraphicalPropertyTypes.WIDTH:
                if (+validValue < 10) {
                    validValue = '10';
                }
                if (+validValue <= +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value) {
                    validValue = (+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value + 1).toString();
                }
                break;
            case GraphicalPropertyTypes.HEIGHT:
                if (+validValue > +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value) {
                    validValue = (+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - 1).toString();
                }
                if (+validValue < 10) {
                    validValue = '10';
                }
                break;

            default:
                break;
        }
        return validValue;
    }

    constructor(obj: IInputOutputConfig) {
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
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.MIRROR_Y)!.v,
            isReadable: false,
            editorType: EditorType.TEXT_EDITOR
        };
    }

    render(handlerMouseDown: (e: React.PointerEvent<SVGGeometryElement>) => void,
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
            stroke={this.config.graphicalProperties[GraphicalPropertyTypes.STROKE_COLOR].value.toString()}
            fill={this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE].value.toString()}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + +layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onBlur={handlerBlur}
            transform={`rotate(${this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value === this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value
                ? +this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value
                : 360 - +this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value}
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value / 2)} 
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value / 2)})`}
            d={`
                M ${this.config.graphicalProperties[GraphicalPropertyTypes.X].value},
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value !==
                    this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value
                    ? +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value : 0)}
                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value / 4} 0
                l -${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value / 4} ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value
                * (this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value !== this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value ? -1 : 1)}
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value / 4} 0
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value / 4} ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value
                * (this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value !== this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value ? 1 : -1)}
                l -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value / 4} 0
            `}
        />
    }
}


export default InputOutput;