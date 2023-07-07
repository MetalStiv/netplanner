import IShapeCreator from "../IShapeCreator";
import { ShapeType } from "../ShapeType";
import IShape, { IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { TShapeInflater } from "../shapeInflaters";
import { IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface IPolylineGraphicalProps extends IShapeGraphicalProps {
    points: [number, number][],
    pathLength?: IGraphicalProperty,
    strokeColor: IGraphicalProperty,
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
            x: {
                label: "X",
                value: messageShape.graphicalProperties.x,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            y: {
                label: "Y",
                value: messageShape.graphicalProperties.y,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            pivot: {
                label: 'Pivot',
                value: messageShape.graphicalProperties.pivot!,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            points: [[15, -30], [40, 45], [50, -70]],
            strokeColor: {
                label: 'Stroke Color',
                value: messageShape.graphicalProperties.strokeColor!,
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
                x: {
                    label: 'X',
                    value: '0',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                y: {
                    label: 'Y',
                    value: '0',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                pivot: {
                    label: 'Pivot',
                    value: '0',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                points: [[15, -30], [40, 45], [50, -70]],
                strokeColor: {
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

    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void,
        handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void,
        layerZIndex: number) {
        let pathStr: string = '';
        this.config.graphicalProperties.points.forEach(el => pathStr = pathStr + ' l' + el.join(' '));
        return <path
            id={this.config.id ?? ''}
            key={this.config.id ?? ''}
            data-type={this.type}
            role="shape"
            stroke={this.config.graphicalProperties.strokeColor.value ?? 'black'}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + +layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={
                `M ${this.config.graphicalProperties.x.value}, ${this.config.graphicalProperties.y.value}
                ${pathStr}`
            }
        />
    }
}


export default Polyline;