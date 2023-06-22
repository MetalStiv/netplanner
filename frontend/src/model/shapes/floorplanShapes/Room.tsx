import IShapeCreator from "../IShapeCreator";
import { TShapeInflater } from "../shapeInflaters";
import { ShapeType } from "../ShapeType";
import IShape, { IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface IRoomProps extends IShapeGraphicalProps {
    width: IGraphicalProperty,
    height: IGraphicalProperty,
    fillColorOne: IGraphicalProperty,
    leftWidth: IGraphicalProperty,
    rightWidth: IGraphicalProperty,
    topWidth: IGraphicalProperty,
    bottomWidth: IGraphicalProperty,
}

export interface IRoomConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: IRoomProps,
    zIndex: number,
}

export const roomInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.ROOM) {
        return null
    }
    return new Room({
        id: messageShape.id,
        zIndex: messageShape.zIndex,
        graphicalProperties: {
            x: {
                label: "X",
                value: messageShape.graphicalProperties.x.value,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            y: {
                label: "Y",
                value: messageShape.graphicalProperties.y.value,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            fillColorOne: {
                label: 'Fill Color One',
                value: messageShape.graphicalProperties.fillColorOne!.value,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            },
            leftWidth: {
                label: "Left width",
                value: messageShape.graphicalProperties.leftWidth!.value,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            rightWidth: {
                label: "Right width",
                value: messageShape.graphicalProperties.rightWidth!.value,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            topWidth: {
                label: "Top width",
                value: messageShape.graphicalProperties.topWidth!.value,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            bottomWidth: {
                label: "Bottom width",
                value: messageShape.graphicalProperties.bottomWidth!.value,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            width: {
                label: "Width",
                value: messageShape.graphicalProperties.width!.value,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            height: {
                label: "Height",
                value: messageShape.graphicalProperties.height!.value,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            pivot: {
                label: "Pivot",
                value: messageShape.graphicalProperties.pivot!.value,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            }
        }
    })
}

export class RoomCreator implements IShapeCreator {
    type: ShapeType = ShapeType.ROOM;
    create() {
        return new Room({
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
                width: {
                    label: 'Width',
                    value: '300',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                height: {
                    label: 'Height',
                    value: '250',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                fillColorOne: {
                    label: 'Fill Color One',
                    value: '#000000',
                    isReadable: true,
                    editorType: EditorType.COLOR_EDITOR
                },
                leftWidth: {
                    label: "Left width",
                    value: '20',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                rightWidth: {
                    label: "Right width",
                    value: '20',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                topWidth: {
                    label: "Top width",
                    value: '20',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                bottomWidth: {
                    label: "Bottom width",
                    value: '20',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
            },
            zIndex: 0,
        });
    }
}

class Room implements IShape {
    type: ShapeType = ShapeType.ROOM;
    config: IRoomConfig;
    isVisible: boolean = true;

    constructor(obj: IRoomConfig) {
        this.config = obj;
        this.config.zIndex = obj.zIndex ?? 0;
    }

    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void,
        handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void,
        layerZIndex: number) {
        return <path
            id={this.config.id}
            key={this.config.id}
            data-type={this.type}
            role="shape"
            stroke="none"
            fill={this.config.graphicalProperties.fillColorOne?.value}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + +layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            transform={`rotate(${this.config.graphicalProperties.pivot.value} 
                ${+this.config.graphicalProperties.x.value + (+this.config.graphicalProperties.width.value / 2)} 
                ${+this.config.graphicalProperties.y.value + (+this.config.graphicalProperties.height.value / 2)})`}
            d={`
                M ${this.config.graphicalProperties.x.value},${this.config.graphicalProperties.y.value} 
                l 0 ${this.config.graphicalProperties.height.value}
                l ${this.config.graphicalProperties.leftWidth.value} 0
                l 0 -${this.config.graphicalProperties.height.value}
                l -${this.config.graphicalProperties.leftWidth.value} 0

                m ${this.config.graphicalProperties.leftWidth.value} 0
                l ${+this.config.graphicalProperties.width.value - +this.config.graphicalProperties.leftWidth.value} 0
                l 0 ${this.config.graphicalProperties.topWidth.value}
                l -${+this.config.graphicalProperties.width.value - +this.config.graphicalProperties.leftWidth.value} 0
                l 0 -${this.config.graphicalProperties.topWidth.value}

                m ${+this.config.graphicalProperties.width.value - +this.config.graphicalProperties.leftWidth.value}
                    ${this.config.graphicalProperties.topWidth.value} 
                l -${this.config.graphicalProperties.rightWidth.value} 0
                l 0 ${+this.config.graphicalProperties.height.value - +this.config.graphicalProperties.topWidth.value}
                l ${this.config.graphicalProperties.rightWidth.value} 0
                l 0 -${+this.config.graphicalProperties.height.value - +this.config.graphicalProperties.topWidth.value}

                m -${this.config.graphicalProperties.rightWidth.value}
                    ${+this.config.graphicalProperties.height.value - +this.config.graphicalProperties.topWidth.value} 
                l -${+this.config.graphicalProperties.width.value - +this.config.graphicalProperties.rightWidth.value - +this.config.graphicalProperties.leftWidth.value} 0
                l 0 -${this.config.graphicalProperties.bottomWidth.value}
                l ${+this.config.graphicalProperties.width.value - +this.config.graphicalProperties.rightWidth.value - +this.config.graphicalProperties.leftWidth.value} 0
                l 0 ${this.config.graphicalProperties.bottomWidth.value}
                `}
        />
    }
}


export default Room;