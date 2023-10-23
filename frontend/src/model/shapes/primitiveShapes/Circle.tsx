import IShapeCreator from "../IShapeCreator";
import { ShapeType } from "../ShapeType";
import { TShapeInflater } from "../shapeInflaters";
import IShape, { GraphicalPropertyTypes, IGraphicalProperty, IShapeConfig, IShapeGraphicalProps, ObjectPropertyTypes } from "../IShape";
import { IMessageProperty, IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface ICircleGraphicalProps extends IShapeGraphicalProps {
    [GraphicalPropertyTypes.R]: IGraphicalProperty,
    [GraphicalPropertyTypes.STROKE_COLOR]: IGraphicalProperty,
    [GraphicalPropertyTypes.FILL_COLOR_ONE]: IGraphicalProperty,
}

export interface ICircleConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: ICircleGraphicalProps,
    zIndex: number,
}

export const circleInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.CIRCLE) {
        return null
    }
    return new Circle({
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
                value: '0',
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.R]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.R)!.v,
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
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.MIRROR_X)!.v,
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

export class CircleCreator implements IShapeCreator {
    type: ShapeType = ShapeType.CIRCLE;
    icon: string = '<circle cx="14" cy="12"r="8" fill="white" stroke="black" stroke-width="2"/>';
    create() {
        return new Circle({
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
                [GraphicalPropertyTypes.R]: {
                    value: '15',
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
            zIndex: 0
        });
    }
}

class Circle implements IShape {
    type: ShapeType = ShapeType.CIRCLE;
    config: ICircleConfig;
    isVisible: boolean = true;

    get overallWidth() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.R].value * 2;
    }
    set overallWidth(value: number) {
        const newRadius = value / 2;
        this.config.graphicalProperties[GraphicalPropertyTypes.R].value =
            this.validateProperty(newRadius.toString(), GraphicalPropertyTypes.R);
    }
    get overallHeight() {
        return this.overallWidth;
    }
    set overallHeight(value: number) {
        const newRadius = value / 2;
        this.config.graphicalProperties[GraphicalPropertyTypes.R].value =
            this.validateProperty(newRadius.toString(), GraphicalPropertyTypes.R);
    }

    validateProperty(value: string, propertyType: GraphicalPropertyTypes) {
        let validValue = value;
        switch (propertyType) {
            case GraphicalPropertyTypes.R:
                if (+validValue < 5) {
                    validValue = '5';
                }
                break;

            default:
                break;
        }
        return validValue;
    }

    constructor(obj: ICircleConfig) {
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
        this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.PIVOT)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.R] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.R)!.v,
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
        // handlerFocus: (e: React.PointerEvent<SVGGeometryElement>) => void,
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
            // filter={isSelected ? 'url(#outlineFilter)' : ''}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            // onPointerDown={handlerFocus}
            // onFocus={handlerFocus}
            onBlur={handlerBlur}
            transform={`rotate(${this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value} 
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.R].value)} 
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.R].value)})`}
            d={`
                M ${this.config.graphicalProperties[GraphicalPropertyTypes.X].value},${(+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value) + (+this.config.graphicalProperties[GraphicalPropertyTypes.R].value)} 
                a ${(this.config.graphicalProperties[GraphicalPropertyTypes.R].value)},${(this.config.graphicalProperties[GraphicalPropertyTypes.R].value)} 0 1,
                    1 ${(+this.config.graphicalProperties[GraphicalPropertyTypes.R].value) * 2},0 
                a ${(this.config.graphicalProperties[GraphicalPropertyTypes.R].value)},${(this.config.graphicalProperties[GraphicalPropertyTypes.R].value)} 0 1,
                    1 -${(+this.config.graphicalProperties[GraphicalPropertyTypes.R].value) * 2},0
            `} />
    }
}


export default Circle;