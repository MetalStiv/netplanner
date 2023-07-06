import IShapeCreator from "../IShapeCreator";
import { TShapeInflater } from "../shapeInflaters";
import { ShapeType } from "../ShapeType";
import IShape, { GraphicalPropertyTypes, IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { IMessageGraphicalProperty, IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface IRoomProps extends IShapeGraphicalProps {
    [GraphicalPropertyTypes.WIDTH]: IGraphicalProperty,
    [GraphicalPropertyTypes.HEIGHT]: IGraphicalProperty,
    [GraphicalPropertyTypes.FILL_COLOR_ONE]: IGraphicalProperty,
    [GraphicalPropertyTypes.LEFT_WIDTH]: IGraphicalProperty,
    [GraphicalPropertyTypes.RIGHT_WIDTH]: IGraphicalProperty,
    [GraphicalPropertyTypes.TOP_WIDTH]: IGraphicalProperty,
    [GraphicalPropertyTypes.BOTTOM_WIDTH]: IGraphicalProperty,
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
            [GraphicalPropertyTypes.FILL_COLOR_ONE]: {
                label: 'Fill Color One',
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.FILL_COLOR_ONE)!.v,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            },
            [GraphicalPropertyTypes.LEFT_WIDTH]: {
                label: "Left width",
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.LEFT_WIDTH)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.RIGHT_WIDTH]: {
                label: "Right width",
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.RIGHT_WIDTH)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.TOP_WIDTH]: {
                label: "Top width",
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.TOP_WIDTH)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.BOTTOM_WIDTH]: {
                label: "Bottom width",
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.BOTTOM_WIDTH)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.WIDTH]: {
                label: "Width",
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.WIDTH)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.HEIGHT]: {
                label: "Height",
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.HEIGHT)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.PIVOT]: {
                label: "Pivot",
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.PIVOT)!.v,
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
                [GraphicalPropertyTypes.WIDTH]: {
                    label: 'Width',
                    value: '300',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.HEIGHT]: {
                    label: 'Height',
                    value: '250',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.FILL_COLOR_ONE]: {
                    label: 'Fill Color One',
                    value: '#000000',
                    isReadable: true,
                    editorType: EditorType.COLOR_EDITOR
                },
                [GraphicalPropertyTypes.LEFT_WIDTH]: {
                    label: "Left width",
                    value: '20',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.RIGHT_WIDTH]: {
                    label: "Right width",
                    value: '20',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.TOP_WIDTH]: {
                    label: "Top width",
                    value: '20',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.BOTTOM_WIDTH]: {
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

    updateGraphicalProperties(m: IMessageGraphicalProperty[]){
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
        this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT] = {
            label: 'Height',
            value: m.find(p => p.l === GraphicalPropertyTypes.HEIGHT)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT] = {
            label: 'Pivot',
            value: m.find(p => p.l === GraphicalPropertyTypes.PIVOT)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE] = {
            label: 'Fill Color One',
            value: m.find(p => p.l === GraphicalPropertyTypes.FILL_COLOR_ONE)!.v,
            isReadable: true,
            editorType: EditorType.COLOR_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.LEFT_WIDTH] = {
            label: 'Left width',
            value: m.find(p => p.l === GraphicalPropertyTypes.LEFT_WIDTH)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.RIGHT_WIDTH] = {
            label: 'Right width',
            value: m.find(p => p.l === GraphicalPropertyTypes.RIGHT_WIDTH)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.TOP_WIDTH] = {
            label: 'Top width',
            value: m.find(p => p.l === GraphicalPropertyTypes.TOP_WIDTH)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.BOTTOM_WIDTH] = {
            label: 'Bottom width',
            value: m.find(p => p.l === GraphicalPropertyTypes.BOTTOM_WIDTH)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
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
            fill={this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE].value}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + +layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            transform={`rotate(${this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value} 
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value / 2)} 
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value / 2)})`}
            d={`
                M ${this.config.graphicalProperties[GraphicalPropertyTypes.X].value},${this.config.graphicalProperties[GraphicalPropertyTypes.Y].value} 
                l 0 ${this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value}
                l ${this.config.graphicalProperties[GraphicalPropertyTypes.LEFT_WIDTH].value} 0
                l 0 -${this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value}
                l -${this.config.graphicalProperties[GraphicalPropertyTypes.LEFT_WIDTH].value} 0

                m ${this.config.graphicalProperties[GraphicalPropertyTypes.LEFT_WIDTH].value} 0
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.LEFT_WIDTH].value} 0
                l 0 ${this.config.graphicalProperties[GraphicalPropertyTypes.TOP_WIDTH].value}
                l -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.LEFT_WIDTH].value} 0
                l 0 -${this.config.graphicalProperties[GraphicalPropertyTypes.TOP_WIDTH].value}

                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.LEFT_WIDTH].value}
                    ${this.config.graphicalProperties[GraphicalPropertyTypes.TOP_WIDTH].value} 
                l -${this.config.graphicalProperties[GraphicalPropertyTypes.RIGHT_WIDTH].value} 0
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value - +this.config.graphicalProperties[GraphicalPropertyTypes.TOP_WIDTH].value}
                l ${this.config.graphicalProperties[GraphicalPropertyTypes.RIGHT_WIDTH].value} 0
                l 0 -${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value - +this.config.graphicalProperties[GraphicalPropertyTypes.TOP_WIDTH].value}

                m -${this.config.graphicalProperties[GraphicalPropertyTypes.RIGHT_WIDTH].value}
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value - +this.config.graphicalProperties[GraphicalPropertyTypes.TOP_WIDTH].value} 
                l -${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.RIGHT_WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.LEFT_WIDTH].value} 0
                l 0 -${this.config.graphicalProperties[GraphicalPropertyTypes.BOTTOM_WIDTH].value}
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.RIGHT_WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.LEFT_WIDTH].value} 0
                l 0 ${this.config.graphicalProperties[GraphicalPropertyTypes.BOTTOM_WIDTH].value}
                `}
        />
    }
}


export default Room;