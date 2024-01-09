import IShapeCreator from "../IShapeCreator";
import { ShapeType } from "../ShapeType";
import IShape, { GraphicalPropertyTypes, IGraphicalProperty, IShapeConfig, IShapeGraphicalProps, ObjectPropertyTypes } from "../IShape";
import { TShapeInflater } from "../shapeInflaters";
import { IMessageProperty, IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface ISubnetGraphicalProps extends IShapeGraphicalProps {
    [GraphicalPropertyTypes.WIDTH]: IGraphicalProperty,
    [GraphicalPropertyTypes.HEIGHT]: IGraphicalProperty,
    [GraphicalPropertyTypes.STROKE_COLOR]: IGraphicalProperty,
    [GraphicalPropertyTypes.FILL_COLOR_ONE]: IGraphicalProperty
}

interface ISubnetConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: ISubnetGraphicalProps
    zIndex: number,
}

export const subnetInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.SUBNET) {
        return null
    }
    return new Subnet({
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
            [GraphicalPropertyTypes.STROKE_COLOR]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.STROKE_COLOR)!.v,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
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
        },
    })
}

export class SubnetCreator implements IShapeCreator {
    type: ShapeType = ShapeType.SUBNET;
    icon: string = `<g>
            <path stroke='#1561d3' fill='#ffffff' stroke-width='2'
                d='M 5 1 m 3 6 a 2 2 0 0 0 1 9 a 1 1 0 0 0 8 2 a 1 1 0 0 0 8 -1 a 2 2 0 0 0 2 -6 a 2 2 0 0 0 -8 -4 a 2 2 0 0 0 -5 0 a 2 2 0 0 0 -5 2' />
        </g>`
    create() {
        return new Subnet({
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
                [GraphicalPropertyTypes.PIVOT]: {
                    value: '0',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.WIDTH]: {
                    value: '45',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.HEIGHT]: {
                    value: '30',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.STROKE_COLOR]: {
                    value: '#1561d3',
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

class Subnet implements IShape {
    type: ShapeType = ShapeType.SUBNET;
    config: ISubnetConfig;
    isVisible: boolean = true;
    zIndex: number = 0;

    get overallWidth() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value;
    }
    set overallWidth(value: number) {
        // this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value =
        //     this.validateProperty(value.toString(), GraphicalPropertyTypes.WIDTH);

        this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value =
            this.validateProperty(value.toString(), GraphicalPropertyTypes.WIDTH);
        this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value =
            this.validateProperty((value*30/45).toString(), GraphicalPropertyTypes.HEIGHT);
    }
    get overallHeight() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value;
    }
    set overallHeight(value: number) {
        // this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value =
        //     this.validateProperty(value.toString(), GraphicalPropertyTypes.HEIGHT);

        this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value =
            this.validateProperty(value.toString(), GraphicalPropertyTypes.HEIGHT);
        this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value =
            this.validateProperty((value*45/30).toString(), GraphicalPropertyTypes.WIDTH);
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

    constructor(obj: ISubnetConfig) {
        this.config = obj;
        this.zIndex = obj.zIndex ?? 0;
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
        }

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
            stroke={this.config.graphicalProperties[GraphicalPropertyTypes.STROKE_COLOR].value.toString() ?? 'black'}
            strokeWidth={+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.015}
            fill={this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE].value.toString() ?? 'black'}
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
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value / 2)})
                `}
            d={
                `M ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value +
                    (this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value === '-1'
                        ?+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value
                        : 0)} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value +
                    + (this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value === '-1' 
                    ? +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value
                    : 0)} 
                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.14*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.3*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.098} ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.1}
                    0 0 ${parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString()) === -1 ? 1: 0} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.05*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.5*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.3} ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.3}
                    0 0 ${parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString()) === -1 ? 1: 0}
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.3*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.15*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.3} ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.3}
                    0 0 ${parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString()) === -1 ? 1: 0}
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.3*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*-0.15*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.11} ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.1}
                    0 0 ${parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString()) === -1 ? 1: 0}
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*-0.4*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.29} ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.3}
                    0 0 ${parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString()) === -1 ? 1: 0}
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*-0.32*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*-0.3*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.3} ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.3}
                    0 0 ${parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString()) === -1 ? 1: 0}
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*-0.2*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.01*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.3} ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.3}
                    0 0 ${parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString()) === -1 ? 1: 0}
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*-0.25*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value.toString())} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.2*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value.toString())}
                `
            }
        />

    }
}


export default Subnet;