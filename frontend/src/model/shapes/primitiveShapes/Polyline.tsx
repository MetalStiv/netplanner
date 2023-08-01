import IShapeCreator from "../IShapeCreator";
import { ShapeType } from "../ShapeType";
import IShape, { GraphicalPropertyTypes, IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { TShapeInflater } from "../shapeInflaters";
import { IMessageGraphicalProperty, IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface IPolylineGraphicalProps extends IShapeGraphicalProps {
    points: [number, number][],
    [GraphicalPropertyTypes.STROKE_COLOR]: IGraphicalProperty,
}

interface IPolylineProps extends IShapeConfig {
    id?: string,
    graphicalProperties: IPolylineGraphicalProps,
    zIndex: number,
}

export const polylineInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.POLYLINE) {
        return null
    }
    return new Polyline({
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
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.PIVOT)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            points: [[15, -30], [40, 45], [50, -70]],
            [GraphicalPropertyTypes.STROKE_COLOR]: {
                label: 'Stroke Color',
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.STROKE_COLOR)!.v,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            }
        }
    })
}

export class PolylineCreator implements IShapeCreator {
    type: ShapeType = ShapeType.POLYLINE;
    create() {
        return new Polyline({
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
                points: [[15, -30], [40, 45], [50, -70]],
                [GraphicalPropertyTypes.STROKE_COLOR]: {
                    label: 'Stroke',
                    value: '#000000',
                    isReadable: true,
                    editorType: EditorType.COLOR_EDITOR
                },
            },
            zIndex: 0,
        });
    }
}

class Polyline implements IShape {
    type: ShapeType = ShapeType.POLYLINE;
    config: IPolylineProps;
    isVisible: boolean = true;
    zIndex: number = 0;

    constructor(obj: IPolylineProps) {
        this.config = obj;
        this.zIndex = obj.zIndex ?? 0;
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
        this.config.graphicalProperties[GraphicalPropertyTypes.STROKE_COLOR] = {
            label: 'Stroke Color',
            value: m.find(p => p.l === GraphicalPropertyTypes.STROKE_COLOR)!.v,
            isReadable: true,
            editorType: EditorType.COLOR_EDITOR
        };
    }

    render(handlerMouseDown: (e: React.PointerEvent<SVGGeometryElement>) => void,
        // handlerFocus: (e: React.FocusEvent<SVGGeometryElement>) => void,
        handlerBlur: (e: React.FocusEvent<SVGGeometryElement>) => void,
        layerZIndex: number,
        isSelected: boolean,
    ) {
        let pathStr: string = '';
        this.config.graphicalProperties.points.forEach(el => pathStr = pathStr + ' l' + el.join(' '));
        return <path
            className={isSelected ? 'selected' : ''}
            data-id={this.config.id ?? ''}
            key={this.config.id ?? ''}
            data-type={this.type}
            role="shape"
            tabIndex={-1}
            stroke={this.config.graphicalProperties[GraphicalPropertyTypes.STROKE_COLOR].value ?? 'black'}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + +layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            // onFocus={handlerFocus}
            onBlur={handlerBlur}
            d={
                `M ${this.config.graphicalProperties[GraphicalPropertyTypes.X].value}, ${this.config.graphicalProperties[GraphicalPropertyTypes.Y].value}
                ${pathStr}`
            }
        />
    }
}


export default Polyline;