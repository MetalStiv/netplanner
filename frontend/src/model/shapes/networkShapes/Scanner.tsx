import IShapeCreator from "../IShapeCreator";
import { TShapeInflater } from "../shapeInflaters";
import { ShapeType } from "../ShapeType";
import IShape, { GraphicalPropertyTypes, IGraphicalProperty, IObjectProperty, IShapeConfig, IShapeGraphicalProps, IShapeObjectProps, ObjectPropertyTypes } from "../IShape";
import { IMessageProperty, IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";
import IConnectionPoint, { ConnectionPointTypes, calculateCPCoords, connectionPointsInflaters } from "../IConnectionPoint";

interface IScannerGraphicalProps extends IShapeGraphicalProps {
    [GraphicalPropertyTypes.WIDTH]: IGraphicalProperty,
    [GraphicalPropertyTypes.FILL_COLOR_ONE]: IGraphicalProperty,
}

interface IScannerObjectProps extends IShapeObjectProps {
    [ObjectPropertyTypes.ID]: IObjectProperty,
    [ObjectPropertyTypes.MANUFACTURER]: IObjectProperty,
    [ObjectPropertyTypes.MODEL]: IObjectProperty,
    [ObjectPropertyTypes.HOST_NAME]: IObjectProperty,
    [ObjectPropertyTypes.IP]: IObjectProperty,
    [ObjectPropertyTypes.MAC]: IObjectProperty,
}

export interface IScannerConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: IScannerGraphicalProps,
    objectProperties: IScannerObjectProps,
    zIndex: number,
}

export const scannerInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.SCANNER) {
        return null
    }
    return new Scanner({
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
            [ObjectPropertyTypes.MANUFACTURER]: {
                value: messageShape.objectProperties ?
                    messageShape.objectProperties.find(p => p.l === ObjectPropertyTypes.MANUFACTURER) ?
                        messageShape.objectProperties.find(p => p.l === ObjectPropertyTypes.MANUFACTURER)!.v : ''
                    : '',
                editorType: EditorType.TEXT_EDITOR
            },
            [ObjectPropertyTypes.MODEL]: {
                value: messageShape.objectProperties ?
                    messageShape.objectProperties.find(p => p.l === ObjectPropertyTypes.MODEL) ?
                        messageShape.objectProperties.find(p => p.l === ObjectPropertyTypes.MODEL)!.v : ''
                    : '',
                editorType: EditorType.TEXT_EDITOR
            },
            [ObjectPropertyTypes.HOST_NAME]: {
                value: messageShape.objectProperties ?
                    messageShape.objectProperties.find(p => p.l === ObjectPropertyTypes.HOST_NAME) ?
                        messageShape.objectProperties.find(p => p.l === ObjectPropertyTypes.HOST_NAME)!.v : ''
                    : '',
                editorType: EditorType.TEXT_EDITOR
            },
            [ObjectPropertyTypes.IP]: {
                value: messageShape.objectProperties ?
                    messageShape.objectProperties.find(p => p.l === ObjectPropertyTypes.IP) ?
                        messageShape.objectProperties.find(p => p.l === ObjectPropertyTypes.IP)!.v : ''
                    : '',
                editorType: EditorType.TEXT_EDITOR
            },
            [ObjectPropertyTypes.MAC]: {
                value: messageShape.objectProperties ?
                    messageShape.objectProperties.find(p => p.l === ObjectPropertyTypes.MAC) ?
                        messageShape.objectProperties.find(p => p.l === ObjectPropertyTypes.MAC)!.v : ''
                    : '',
                editorType: EditorType.TEXT_EDITOR
            },
        },
        connectionPoints: (() => {
            const w = +messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.WIDTH)!.v;
            const h = +messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.WIDTH)!.v / 2;

            return messageShape?.connectionPoints.map(point => connectionPointsInflaters.inflate(point, w, h)!)
                ?? [ConnectionPointTypes.CENTER].map(type => {
                    const { relativeCoords, markerOffset } = calculateCPCoords(type, w, h);
                    return ({
                        id: '',
                        type,
                        relativeCoords,
                        markerOffset,
                        connectionAreaRadius: (w > h ? w : h) / 2 + 8,
                        connectedShapes: null
                    });
                })
        })()
    })
}

export class ScannerCreator implements IShapeCreator {
    type: ShapeType = ShapeType.SCANNER;
    icon: string = `<g>
            <path stroke='#1561d3' fill='#ffffff' stroke-width='2'
                d='M 6 10 l 24 0 l 0 5 l -24 0 l 0 -5 l 24 -5' />
        </g>`
    create() {
        return new Scanner({
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

                [GraphicalPropertyTypes.FILL_COLOR_ONE]: {
                    value: '#1561d3',
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
                    editorType: EditorType.TEXT_EDITOR,
                },
                [ObjectPropertyTypes.MANUFACTURER]: {
                    value: '',
                    editorType: EditorType.TEXT_EDITOR,
                },
                [ObjectPropertyTypes.MODEL]: {
                    value: '',
                    editorType: EditorType.TEXT_EDITOR,
                },
                [ObjectPropertyTypes.HOST_NAME]: {
                    value: '',
                    editorType: EditorType.TEXT_EDITOR,
                },
                [ObjectPropertyTypes.IP]: {
                    value: '',
                    editorType: EditorType.TEXT_EDITOR,
                },
                [ObjectPropertyTypes.MAC]: {
                    value: '',
                    editorType: EditorType.TEXT_EDITOR,
                },
            },
            zIndex: 0,
            connectionPoints: [ConnectionPointTypes.CENTER]
                .map(type => {
                    const { relativeCoords, markerOffset } = calculateCPCoords(type, 60, 30);
                    return ({
                        id: '',
                        type,
                        relativeCoords,
                        markerOffset,
                        connectionAreaRadius: 34,
                        connectedShapes: null
                    });
                })
        });
    }
}

class Scanner implements IShape {
    type: ShapeType = ShapeType.SCANNER;
    config: IScannerConfig;
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
        return +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value / 2;
    }
    set overallHeight(value: number) {
        const newWidth = this.validateProperty((value * 2).toString(), GraphicalPropertyTypes.WIDTH);
        this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value = newWidth;
        if (this.config.connectionPoints?.length) {
            this.config.connectionPoints =
                this.config.connectionPoints.map(p => ({ ...p, relativeCoords: calculateCPCoords(p.type, +newWidth, +newWidth / 2).relativeCoords }));
        }
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

    constructor(obj: IScannerConfig) {
        this.config = obj;
        this.config.zIndex = obj.zIndex ?? 0;
    }

    updateObjectProperties(m: IMessageProperty[]) {
        this.config.objectProperties[ObjectPropertyTypes.ID] = {
            value: m.find(p => p.l === ObjectPropertyTypes.ID)!.v,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.objectProperties[ObjectPropertyTypes.MANUFACTURER] = {
            value: m.find(p => p.l === ObjectPropertyTypes.MANUFACTURER)!.v,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.objectProperties[ObjectPropertyTypes.MODEL] = {
            value: m.find(p => p.l === ObjectPropertyTypes.MODEL)!.v,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.objectProperties[ObjectPropertyTypes.HOST_NAME] = {
            value: m.find(p => p.l === ObjectPropertyTypes.HOST_NAME)!.v,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.objectProperties[ObjectPropertyTypes.IP] = {
            value: m.find(p => p.l === ObjectPropertyTypes.IP)!.v,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.objectProperties[ObjectPropertyTypes.MAC] = {
            value: m.find(p => p.l === ObjectPropertyTypes.MAC)!.v,
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
        return <g
            key={this.config.id}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + +layerZIndex }}
        >
            <path
                key={this.config.id + '_1'}
                fill={this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE].value.toString()}
                stroke={this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE].value.toString()}
                fillRule="nonzero"
                onBlur={handlerBlur}
                transform={`rotate(${this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value === this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value
                    ? +this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value
                    : 360 - +this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value}
                        
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value / 2)} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value / 4)})`}
                d={`
                    M ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + (this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value === '-1'
                        ? +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value
                        : 0)},
                        ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value === '-1'
                        ? +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.5
                        : 0)}

                    m 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.2
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}

                    l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 0

                    l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.3
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}

                    l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -1
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 0

                    l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -0.3
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}

                    l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.95
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())}
                        ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -0.2
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}

                    l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.02
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())}
                        ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.05
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}

                    l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -0.95
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())}
                        ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.2
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                `}
            />

            <path
                key={this.config.id + '_3'}
                fill={'#ffffff'}
                stroke={this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE].value.toString()}
                fillRule="nonzero"
                onBlur={handlerBlur}
                transform={`rotate(${this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value === this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value
                    ? +this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value
                    : 360 - +this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value}
                        
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value) / 2} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value / 4)})`}
                d={`
                    M ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + (this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value === '-1'
                        ? +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value
                        : 0)},
                        ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value === '-1'
                        ? +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.5
                        : 0)}

                    m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.1
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())}
                        ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.3
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}

                    l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.2
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 0

                    l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.1
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}

                    l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -0.2
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 0

                    l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -0.1
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                    
                    m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.8
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())}
                        ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.02
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}

                    a ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.04} 
                        ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.04}
                        0 1,0 ${-1 * +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.08
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())}, 0
                        
                    a ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.04} 
                        ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.04}
                        0 1,0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.08
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())}, 0
                `}
            />

            <path
                key={this.config.id + '_5'}
                className={isSelected ? 'selected' : ''}
                data-id={this.config.id}
                data-type={this.type}
                role="shape"
                tabIndex={-1}
                stroke={this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE].value.toString()}
                fill={this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE].value.toString()}
                opacity="0"
                fillRule="nonzero"
                onDragStart={(e) => e.preventDefault}
                onMouseDown={handlerMouseDown}
                onBlur={handlerBlur}
                transform={`rotate(${this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value === this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value
                    ? +this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value
                    : 360 - +this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value}
                        
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value / 2)} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value / 4)})`}
                d={`
                    M ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + (this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value === '-1'
                        ? +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 2
                        : 0)},
                        ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value === '-1'
                        ? +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.5
                        : 0)}

                    l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 0

                    l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.5
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}

                    l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -1
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 0

                    l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * -0.5
                    * parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                `}
            />

        </g>
    }
}

export default Scanner;