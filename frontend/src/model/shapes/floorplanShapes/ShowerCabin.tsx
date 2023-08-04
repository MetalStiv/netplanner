import IShapeCreator from "../IShapeCreator";
import { TShapeInflater } from "../shapeInflaters";
import { ShapeType } from "../ShapeType";
import IShape, { GraphicalPropertyTypes, IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { IMessageGraphicalProperty, IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface IShowerCabinProps extends IShapeGraphicalProps {
    [GraphicalPropertyTypes.WIDTH]: IGraphicalProperty,
    [GraphicalPropertyTypes.FILL_COLOR_ONE]: IGraphicalProperty,
    [GraphicalPropertyTypes.STROKE_COLOR]: IGraphicalProperty,
}

export interface IShowerCabinConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: IShowerCabinProps,
    zIndex: number,
}

export const showerCabinInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.SHOWER_CABIN) {
        return null
    }
    return new ShowerCabin({
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
                label: "Pivot",
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.PIVOT)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.WIDTH]: {
                label: "Width",
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.WIDTH)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.FILL_COLOR_ONE]: {
                label: 'Fill Color One',
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.FILL_COLOR_ONE)!.v,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            },
            [GraphicalPropertyTypes.STROKE_COLOR]: {
                label: 'Stroke',
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.STROKE_COLOR)!.v,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            },
        }
    })
}

export class ShowerCabinCreator implements IShapeCreator {
    type: ShapeType = ShapeType.SHOWER_CABIN;
    create() {
        return new ShowerCabin({
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
                [GraphicalPropertyTypes.WIDTH]: {
                    label: 'Width',
                    value: '80',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.PIVOT]: {
                    label: 'Pivot',
                    value: '0',
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
                }
            },
            zIndex: 0,
        });
    }
}

class ShowerCabin implements IShape {
    type: ShapeType = ShapeType.SHOWER_CABIN;
    config: IShowerCabinConfig;
    isVisible: boolean = true;

    get overallWidth() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value;
    }
    set overallWidth(value: number) {
        this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value = value.toString();
    }
    get overallHeight() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value;
    }
    set overallHeight(value: number) {
        this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value = value.toString();
    }

    constructor(obj: IShowerCabinConfig) {
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
        this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH] = {
            label: 'Width',
            value: m.find(p => p.l === GraphicalPropertyTypes.WIDTH)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT] = {
            label: 'Pivot',
            value: m.find(p => p.l === GraphicalPropertyTypes.PIVOT)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.STROKE_COLOR] = {
            label: 'Stroke Color',
            value: m.find(p => p.l === GraphicalPropertyTypes.STROKE_COLOR)!.v,
            isReadable: true,
            editorType: EditorType.COLOR_EDITOR
        };

        this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE] = {
            label: 'Fill Color One',
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
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value / 2)})`}
            d={`
                M ${this.config.graphicalProperties[GraphicalPropertyTypes.X].value},${this.config.graphicalProperties[GraphicalPropertyTypes.Y].value} 
                l ${this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value} 0
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value}
                l -${this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value} 0
                l 0 -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value}

                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.1},${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.1} 
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.8} 0
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.8}
                l -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.8} 0
                l 0 -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.8}

                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.3},${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.3}
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.3},${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.3} 

                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.05}, -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.05}
                l 0, -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.35} 
                
                m -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.1}, ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.45}
                l -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.35} 0

                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.49} 0
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.04} ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.04}
                    0 1,0 -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.08},0
                a ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.04} ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.04}
                    0 1,0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value*0.08},0
            `}
        />
    }
}

export default ShowerCabin;