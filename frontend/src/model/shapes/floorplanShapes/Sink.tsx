import IShapeCreator from "../IShapeCreator";
import { TShapeInflater } from "../shapeInflaters";
import { ShapeType } from "../ShapeType";
import IShape, { GraphicalPropertyTypes, IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { IMessageGraphicalProperty, IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface ISinkProps extends IShapeGraphicalProps {
    [GraphicalPropertyTypes.WIDTH]: IGraphicalProperty,
    [GraphicalPropertyTypes.HEIGHT]: IGraphicalProperty,
    [GraphicalPropertyTypes.FILL_COLOR_ONE]: IGraphicalProperty,
    [GraphicalPropertyTypes.STROKE_COLOR]: IGraphicalProperty,
}

export interface ISinkConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: ISinkProps,
    zIndex: number,
}

export const sinkInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.SINK) {
        return null
    }
    return new Sink({
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
        }
    })
}

export class SinkCreator implements IShapeCreator {
    type: ShapeType = ShapeType.SINK;
    create() {
        return new Sink({
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
                }
            },
            zIndex: 0,
        });
    }
}

class Sink implements IShape {
    type: ShapeType = ShapeType.SINK;
    config: ISinkConfig;
    isVisible: boolean = true;

    get overallWidth() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value;
    }
    set overallWidth(value: number) {
        this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value = value.toString();
    }
    get overallHeight() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value;
    }
    set overallHeight(value: number) {
        this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value = value.toString();
    }

    constructor(obj: ISinkConfig) {
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
            transform={`rotate(${this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value} 
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value / 2)} 
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value / 2)})`}
            d={`
                M ${this.config.graphicalProperties[GraphicalPropertyTypes.X].value},${this.config.graphicalProperties[GraphicalPropertyTypes.Y].value} 
                l ${this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value} 0
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value}
                l -${this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value} 0
                l 0 -${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value}

                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.95} ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.1}
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.46} ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value}
                    0 0 1 -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.9} 0
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.9} 0
                
                m -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.44} -${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.05}
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.30}
                l -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.04} 0
                l 0 -${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.30}
                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.1} 0
                l -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.18} 0
            `}
        />
    }
}

export default Sink;