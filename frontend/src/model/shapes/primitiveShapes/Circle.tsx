import IShapeCreator from "../IShapeCreator";
import { ShapeType } from "../ShapeType";
import { TShapeInflater } from "../shapeInflaters";
import IShape, { GraphicalPropertyTypes, IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { IMessageGraphicalProperty, IMessageShape } from "../../message/IMessageShape";
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
                label: "X",
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.X)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.Y]: {
                label: "Y",
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.Y)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.PIVOT]: {
                label: 'Pivot',
                value: '0',
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.R]: {
                label: "Radius",
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.R)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.STROKE_COLOR]: {
                label: "Stroke Color",
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.STROKE_COLOR)!.v,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            },
            [GraphicalPropertyTypes.FILL_COLOR_ONE]: {
                label: "Fill Color One",
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.FILL_COLOR_ONE)!.v,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            },
        },

    })
}

export class CircleCreator implements IShapeCreator {
    type: ShapeType = ShapeType.CIRCLE;
    create() {
        return new Circle({
            graphicalProperties: {
                [GraphicalPropertyTypes.X]: {
                    label: 'X',
                    value: '0',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.Y]: {
                    label: 'Y',
                    value: '0',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.PIVOT]: {
                    label: 'Pivot',
                    value: '0',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.R]: {
                    label: 'Radius',
                    value: '15',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.STROKE_COLOR]: {
                    label: 'Stroke Color',
                    value: '#000000',
                    isReadable: true,
                    editorType: EditorType.COLOR_EDITOR
                },
                [GraphicalPropertyTypes.FILL_COLOR_ONE]: {
                    label: 'Fill Color One',
                    value: '#ffffff',
                    isReadable: true,
                    editorType: EditorType.COLOR_EDITOR
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
        this.config.graphicalProperties[GraphicalPropertyTypes.R].value = newRadius.toString();
    }
    get overallHeight() {
        return this.overallWidth;
    }
    set overallHeight(value: number) {
        this.overallWidth = value;
    }

    constructor(obj: ICircleConfig) {
        this.config = obj;
        this.config.zIndex = obj.zIndex ?? 0;
    }

    updateGraphicalProperties(m: IMessageGraphicalProperty[]) {
        this.config.graphicalProperties[GraphicalPropertyTypes.X] = {
            label: 'X',
            value: m.find(p => p.l === GraphicalPropertyTypes.X)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.Y] = {
            label: 'Y',
            value: m.find(p => p.l === GraphicalPropertyTypes.Y)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT] = {
            label: 'Pivot',
            value: m.find(p => p.l === GraphicalPropertyTypes.PIVOT)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.R] = {
            label: 'Radius',
            value: m.find(p => p.l === GraphicalPropertyTypes.R)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE] = {
            label: 'Fill Color One',
            value: m.find(p => p.l === GraphicalPropertyTypes.FILL_COLOR_ONE)!.v,
            isReadable: true,
            editorType: EditorType.COLOR_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.STROKE_COLOR] = {
            label: 'Stroke Color',
            value: m.find(p => p.l === GraphicalPropertyTypes.STROKE_COLOR)!.v,
            isReadable: true,
            editorType: EditorType.COLOR_EDITOR
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
            stroke={this.config.graphicalProperties[GraphicalPropertyTypes.STROKE_COLOR].value}
            fill={this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE].value}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + +layerZIndex }}
            // filter={isSelected ? 'url(#outlineFilter)' : ''}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            // onPointerDown={handlerFocus}
            // onFocus={handlerFocus}
            onBlur={handlerBlur}
            transform={`rotate(${this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value} 
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.R].value / 2)} 
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.R].value / 2)})`}
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