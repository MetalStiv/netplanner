import IShapeCreator from "../IShapeCreator";
import { TShapeInflater } from "../shapeInflaters";
import { ShapeType } from "../ShapeType";
import IShape, { GraphicalPropertyTypes, IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { IMessageGraphicalProperty, IMessageShape } from "../../message/IMessageShape";
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
        }
    })
}

export class ToiletCreator implements IShapeCreator {
    type: ShapeType = ShapeType.TOILET;
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
                }
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
        this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value = value.toString();
    }
    get overallHeight() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value;
    }
    set overallHeight(value: number) {
        this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value = value.toString();
    }

    constructor(obj: IToiletConfig) {
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
                M ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.2}
                    ${(+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value)}
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.4} 0
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.2},${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.2} 0 1,
                    1 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.4}
                l -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.4} 0  
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.2},${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.2} 0 1,
                    1 0 -${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.4}

                M ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.25}
                    ${(+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.4)}
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.34}
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.1},${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.1} 0 1,
                    0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.5} 0
                l 0 -${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.34}
                
                M ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.3}
                    ${(+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.48)}
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.28}
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.1},${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.1} 0 1,
                    0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.6} 0
                l 0 -${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.28}
                l -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.6} 0

                M ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.5}
                    ${(+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value*0.15)}
                m 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.05}
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.02} ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.02}
                    0 1,1 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.04},0
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.02} ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.02}
                    0 1,1 -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.04},0
            `}
        />
    }
}

export default Toilet;