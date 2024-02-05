import IShapeCreator from "../IShapeCreator";
import { ShapeType } from "../ShapeType";
import IShape, { GraphicalPropertyTypes, IGraphicalProperty, IObjectProperty, IShapeConfig, IShapeGraphicalProps, IShapeObjectProps, ObjectPropertyTypes } from "../IShape";
import { TShapeInflater } from "../shapeInflaters";
import { IMessageProperty, IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";
import SvgTextInputProps from "../../../components/SvgTextInput/SvgTextInput";

interface ITextGraphicalProps extends IShapeGraphicalProps {
    [GraphicalPropertyTypes.STROKE_COLOR]: IGraphicalProperty,
    [GraphicalPropertyTypes.FILL_COLOR_ONE]: IGraphicalProperty,
    [GraphicalPropertyTypes.RX]: IGraphicalProperty,
    [GraphicalPropertyTypes.RY]: IGraphicalProperty,
}

interface ITextObjectProps extends IShapeObjectProps {
    [ObjectPropertyTypes.ID]: IObjectProperty,
    [ObjectPropertyTypes.TEXT]: IObjectProperty,
}

interface ITextConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: ITextGraphicalProps,
    objectProperties: ITextObjectProps,
    zIndex: number,
}

export const textInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.TEXT) {
        return null
    }
    return new Text({
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
            [GraphicalPropertyTypes.RX]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.RX)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.RY]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.RY)!.v,
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
            [ObjectPropertyTypes.TEXT]: {
                value: messageShape.objectProperties ?
                    messageShape.objectProperties.find(p => p.l === ObjectPropertyTypes.TEXT) ?
                    messageShape.objectProperties.find(p => p.l === ObjectPropertyTypes.TEXT)!.v : ''
                    : '',
                editorType: EditorType.TEXT_EDITOR
            },
        },
    })
}

export class TextCreator implements IShapeCreator {
    type: ShapeType = ShapeType.TEXT;
    icon: string = '<text x="5" y="18" font-size="16" font-family="Inter">Aa<text/>';
    create() {
        return new Text({
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
                [GraphicalPropertyTypes.RX]: {
                    value: '30',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.RY]: {
                    value: '20',
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
                [ObjectPropertyTypes.TEXT]: {
                    value: 'Text',
                    editorType: EditorType.TEXT_EDITOR
                },
            },
            zIndex: 0,
        });
    }
}

class Text implements IShape {
    type: ShapeType = ShapeType.TEXT;
    config: ITextConfig;
    isVisible: boolean = true;
    zIndex: number = 0;
    isEditable: boolean = false;

    get overallWidth() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.RX].value * 2;
    }
    set overallWidth(value: number) {
        const newRadius = value / 2;
        this.config.graphicalProperties[GraphicalPropertyTypes.RX].value =
            this.validateProperty(newRadius.toString(), GraphicalPropertyTypes.RX);
    }
    get overallHeight() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.RY].value * 2;
    }
    set overallHeight(value: number) {
        const newRadius = value / 2;
        this.config.graphicalProperties[GraphicalPropertyTypes.RY].value =
            this.validateProperty(newRadius.toString(), GraphicalPropertyTypes.RY);
    }

    validateProperty(value: string, propertyType: GraphicalPropertyTypes) {
        let validValue = value;
        switch (propertyType) {
            case GraphicalPropertyTypes.RX:
            case GraphicalPropertyTypes.RY:
                if (+validValue < 5) {
                    validValue = '5';
                }
                break;

            default:
                break;
        }
        return validValue;
    }

    constructor(obj: ITextConfig) {
        this.config = obj;
        this.zIndex = obj.zIndex ?? 0;
    }

    updateObjectProperties(m: IMessageProperty[]) {
        this.config.objectProperties[ObjectPropertyTypes.ID] = {
            value: m.find(p => p.l === ObjectPropertyTypes.ID)!.v,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.objectProperties[ObjectPropertyTypes.TEXT] = {
            value: m.find(p => p.l === ObjectPropertyTypes.TEXT)!.v,
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
        this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.PIVOT)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.RX] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.RX)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.RY] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.RY)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.FILL_COLOR_ONE)!.v,
            isReadable: true,
            editorType: EditorType.COLOR_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.STROKE_COLOR] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.STROKE_COLOR)!.v,
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
        if (!isSelected){
            this.isEditable = false;
        }
        
        return <g
                className={isSelected ? 'selected' : ''}
                data-id={this.config.id}
                key={this.config.id+'_1'}
                onDragStart={(e) => e.preventDefault}
                onMouseDown={handlerMouseDown}
                onDoubleClick={() => this.isEditable = !this.isEditable}
                role="shape"
                tabIndex={-1}
                onBlur={handlerBlur}
                transform={`rotate(${
                    this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value === this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value
                        ? +this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value
                        : 360-+this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value}
                        
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + 12*0.8*this.config.objectProperties[ObjectPropertyTypes.TEXT].value.length / 2} 
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + 12 / 2})`}

                style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + +layerZIndex }}>
            {
                this.isEditable && isSelected ?
                    <SvgTextInputProps 
                        keyVal={this.config.id+'_2'} 
                        x={this.config.graphicalProperties[GraphicalPropertyTypes.X].value.toString()}
                        y={this.config.graphicalProperties[GraphicalPropertyTypes.Y].value.toString()}
                        value={Array.isArray(this.config.objectProperties[ObjectPropertyTypes.TEXT].value) ? '' 
                            : this.config.objectProperties[ObjectPropertyTypes.TEXT].value}
                        shape={this}
                        onExit={() => {
                            this.isEditable = false;
                            isSelected = false;
                        }}
                    />
                    : <text
                        key={this.config.id+'_3'}
                        x={this.config.graphicalProperties[GraphicalPropertyTypes.X].value.toString()} 
                        y={this.config.graphicalProperties[GraphicalPropertyTypes.Y].value.toString()}
                        role='text'
                        filter='none'
                    >
                        {this.config.objectProperties[ObjectPropertyTypes.TEXT].value}
                    </text>
            }
        </g>
    }
}


export default Text;