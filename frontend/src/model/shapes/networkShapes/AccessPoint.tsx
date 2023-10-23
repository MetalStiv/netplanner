import IShapeCreator from "../IShapeCreator";
import { TShapeInflater } from "../shapeInflaters";
import { ShapeType } from "../ShapeType";
import IShape, { GraphicalPropertyTypes, IGraphicalProperty, IObjectProperty, IShapeConfig, IShapeGraphicalProps, IShapeObjectProps, ObjectPropertyTypes } from "../IShape";
import { IMessageProperty, IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface IAccessPointProps extends IShapeGraphicalProps {
    [GraphicalPropertyTypes.WIDTH]: IGraphicalProperty,
    [GraphicalPropertyTypes.FILL_COLOR_ONE]: IGraphicalProperty,
}

interface IAccessPointObjectProps extends IShapeObjectProps {
    [ObjectPropertyTypes.ID]: IObjectProperty,
    [ObjectPropertyTypes.OS]: IObjectProperty,
    [ObjectPropertyTypes.MANUFACTURER]: IObjectProperty,
    [ObjectPropertyTypes.MODEL]: IObjectProperty,
    [ObjectPropertyTypes.HOST_NAME]: IObjectProperty,
    [ObjectPropertyTypes.IP]: IObjectProperty,
    [ObjectPropertyTypes.MAC]: IObjectProperty,
}

export interface IAccessPointConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: IAccessPointProps,
    objectProperties: IAccessPointObjectProps,
    zIndex: number,
}

export const accessPointInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.ACCESS_POINT) {
        return null
    }
    return new AccessPoint({
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
            [ObjectPropertyTypes.OS]: {
                value: messageShape.objectProperties ?
                    messageShape.objectProperties.find(p => p.l === ObjectPropertyTypes.OS) ?
                    messageShape.objectProperties.find(p => p.l === ObjectPropertyTypes.OS)!.v : ''
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
    })
}

export class AccessPointCreator implements IShapeCreator {
    type: ShapeType = ShapeType.ACCESS_POINT;
    // icon: string = '<path d="M 6 1 l 20 0 l 0 20 l -20 0 l 0 -20 m 16 12 l 0 -5 m -4 9 l -5 0'
    //     + ' m 8 0 a 1 1 0 1 0 2 0 a 1 1 0 1 0 -2 0"'
    //     + ' fill="white" stroke="black" stroke-width="2"/>';
    icon: string = `<g>
            <path stroke='#1561d3' fill='#1561d3' 
                d='M 6 11 a 10 10 0 1 0 20 0 a 10 10 0 1 0 -20 0' />
            <path stroke='#ffffff' fill='#1561d3' strokeWidth='4' strokeLinecap="round"
                d='M 21 10 c -2 -2 -8 -2 -10 0' />
            <path stroke='#ffffff' fill='#1561d3' strokeWidth='4' strokeLinecap="round"
                d='M 19 13 c -2 -2 -4 -2 -6 0' />
            <path stroke='#ffffff' fill='#ffffff' strokeWidth='4' strokeLinecap="round"
                d='M 17 16 a 1 1 0 1 0 -2 0 a 1 1 0 1 0 2 0' />
        </g>`
    create() {
        return new AccessPoint({
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
                    value: '30',
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
                    editorType: EditorType.TEXT_EDITOR
                },
                [ObjectPropertyTypes.OS]: {
                    value: '',
                    editorType: EditorType.TEXT_EDITOR
                },
                [ObjectPropertyTypes.MANUFACTURER]: {
                    value: '',
                    editorType: EditorType.TEXT_EDITOR
                },
                [ObjectPropertyTypes.MODEL]: {
                    value: '',
                    editorType: EditorType.TEXT_EDITOR
                },
                [ObjectPropertyTypes.HOST_NAME]: {
                    value: '',
                    editorType: EditorType.TEXT_EDITOR
                },
                [ObjectPropertyTypes.IP]: {
                    value: '',
                    editorType: EditorType.TEXT_EDITOR
                },
                [ObjectPropertyTypes.MAC]: {
                    value: '',
                    editorType: EditorType.TEXT_EDITOR
                },
            },
            zIndex: 0,
        });
    }
}

class AccessPoint implements IShape {
    type: ShapeType = ShapeType.ACCESS_POINT;
    config: IAccessPointConfig;
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

    constructor(obj: IAccessPointConfig) {
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
        this.config.objectProperties[ObjectPropertyTypes.OS] = {
            value: m.find(p => p.l === ObjectPropertyTypes.OS)!.v,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.objectProperties[ObjectPropertyTypes.MAC] = {
            value: m.find(p => p.l === ObjectPropertyTypes.MAC)!.v,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.objectProperties[ObjectPropertyTypes.IP] = {
            value: m.find(p => p.l === ObjectPropertyTypes.IP)!.v,
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
        // handlerFocus: (e: React.FocusEvent<SVGGeometryElement>) => void,
        handlerBlur: (e: React.FocusEvent<SVGGeometryElement>) => void,
        layerZIndex: number,
        isSelected: boolean,
    ) {
        return <g
            key={this.config.id}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + +layerZIndex }}
            >
            <path
                key={this.config.id+'_1'}
                className={isSelected ? 'selected' : ''}
                data-id={this.config.id}
                data-type={this.type}
                role="shape"
                tabIndex={-1}
                stroke={this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE].value.toString()}
                fill={this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE].value.toString()}
                fillRule="nonzero"
                onDragStart={(e) => e.preventDefault}
                onMouseDown={handlerMouseDown}
                // onFocus={handlerFocus}
                onBlur={handlerBlur}
                d={`
                    M ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value},
                        ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value}

                    m 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value * 0.5}

                    a ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.5} 
                        ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.5}
                        0 1,0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value}, 0
                        
                    a ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.5} 
                        ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.5}
                        0 1,0 ${-1*+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value}, 0
                `}
            />

            <path
                key={this.config.id+'_2'}
                stroke={"#ffffff"}
                strokeWidth={+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.06}
                strokeLinecap="round"
                fill={this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE].value.toString()}
                fillRule="nonzero"
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

                    m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.85
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())}
                        ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.48
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())
                    }

                    c ${-1*+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.1
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())}
                        ${-1*+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.17
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}

                        ${-1*+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.58
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())}
                        ${-1*+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.17
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}

                        ${-1*+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.7
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 0
                `}
            />

            <path
                key={this.config.id+'_3'}
                stroke={"#ffffff"}
                strokeWidth={+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.06}
                strokeLinecap="round"
                fill={this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE].value.toString()}
                fillRule="nonzero"
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

                    m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.75
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())}
                        ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.58
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())
                    }

                    c ${-1*+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.1
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())}
                        ${-1*+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.12
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}

                        ${-1*+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.4
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())}
                        ${-1*+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.12
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}

                        ${-1*+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.5
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 0
                `}
            />

            <path
                key={this.config.id+'_4'}
                stroke={"#ffffff"}
                strokeWidth={+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.06}
                strokeLinecap="round"
                fill={this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE].value.toString()}
                fillRule="nonzero"
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

                    m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.65
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())}
                        ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.68
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())
                    }

                    c ${-1*+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.1
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())}
                        ${-1*+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.067
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}

                        ${-1*+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.2
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())}
                        ${-1*+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.067
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}

                        ${-1*+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.3
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 0
                `}
            />

            <path
                key={this.config.id+'_5'}
                stroke={"#ffffff"}
                fill={"#ffffff"}
                fillRule="nonzero"
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

                    m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.54
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())}
                        ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.76
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())
                    }

                    a ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.04} 
                        ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.04}
                        0 1,0 ${-1* +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.08
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())}, 0
                        
                    a ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.04} 
                        ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.04}
                        0 1,0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.08
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())}, 0
                `}
            />
        </g>
    }
}

export default AccessPoint;