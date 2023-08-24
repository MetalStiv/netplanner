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
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.X)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.Y]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.Y)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.FILL_COLOR_ONE]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.FILL_COLOR_ONE)!.v,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            },
            [GraphicalPropertyTypes.LEFT_WIDTH]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.LEFT_WIDTH)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.RIGHT_WIDTH]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.RIGHT_WIDTH)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.TOP_WIDTH]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.TOP_WIDTH)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.BOTTOM_WIDTH]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.BOTTOM_WIDTH)!.v,
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
            [GraphicalPropertyTypes.PIVOT]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.PIVOT)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
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
        }
    })
}

export class RoomCreator implements IShapeCreator {
    type: ShapeType = ShapeType.ROOM;
    create() {
        return new Room({
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
                [GraphicalPropertyTypes.WIDTH]: {
                    value: '300',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.HEIGHT]: {
                    value: '250',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.FILL_COLOR_ONE]: {
                    value: '#000000',
                    isReadable: true,
                    editorType: EditorType.COLOR_EDITOR
                },
                [GraphicalPropertyTypes.LEFT_WIDTH]: {
                    value: '20',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.RIGHT_WIDTH]: {
                    value: '20',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.TOP_WIDTH]: {
                    value: '20',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.BOTTOM_WIDTH]: {
                    value: '20',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
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
            zIndex: 0,
        });
    }
}

class Room implements IShape {
    type: ShapeType = ShapeType.ROOM;
    config: IRoomConfig;
    isVisible: boolean = true;

    get overallWidth() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value;
    }
    set overallWidth(value: number) {
        value > +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value &&
            (this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value = value.toString());
    }
    get overallHeight() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value;
    }
    set overallHeight(value: number) {
        value < +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value &&
            (this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value = value.toString());
    }

    constructor(obj: IRoomConfig) {
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
        this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.FILL_COLOR_ONE)!.v,
            isReadable: true,
            editorType: EditorType.COLOR_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.LEFT_WIDTH] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.LEFT_WIDTH)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.RIGHT_WIDTH] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.RIGHT_WIDTH)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.TOP_WIDTH] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.TOP_WIDTH)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.BOTTOM_WIDTH] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.BOTTOM_WIDTH)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
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
        return <path
            className={isSelected ? 'selected' : ''}
            data-id={this.config.id}
            key={this.config.id}
            data-type={this.type}
            role="shape"
            tabIndex={-1}
            stroke="none"
            fill={this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE].value}
            fillRule="nonzero"
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + +layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            // onFocus={handlerFocus}
            onBlur={handlerBlur}
            transform={`rotate(${
                this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value === this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value
                    ? +this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value
                    : 360-+this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value}
                    
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value / 2)} 
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value / 2)})`}
            d={`
                M ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + (this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value === '-1' ?
                    +this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value
                    : 0)},
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value === '-1' 
                    ? +this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value
                    : 0)} 
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.LEFT_WIDTH].value
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 0
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value * -1
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.LEFT_WIDTH].value
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 0

                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.LEFT_WIDTH].value
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 0
                l ${(+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.LEFT_WIDTH].value)
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 0
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.TOP_WIDTH].value
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                l ${(+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.LEFT_WIDTH].value)
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 0
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.TOP_WIDTH].value
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}

                m ${(+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.LEFT_WIDTH].value)
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)}
                    ${+this.config.graphicalProperties[GraphicalPropertyTypes.TOP_WIDTH].value
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)} 
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.RIGHT_WIDTH].value
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 0
                l 0 ${(+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value - +this.config.graphicalProperties[GraphicalPropertyTypes.TOP_WIDTH].value)
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                l ${+this.config.graphicalProperties[GraphicalPropertyTypes.RIGHT_WIDTH].value
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 0
                l 0 ${(+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value - +this.config.graphicalProperties[GraphicalPropertyTypes.TOP_WIDTH].value)
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}

                m ${+this.config.graphicalProperties[GraphicalPropertyTypes.RIGHT_WIDTH].value
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)}
                    ${(+this.config.graphicalProperties[GraphicalPropertyTypes.HEIGHT].value - +this.config.graphicalProperties[GraphicalPropertyTypes.TOP_WIDTH].value)
                        *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)} 
                l ${(+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.RIGHT_WIDTH].value - 
                    +this.config.graphicalProperties[GraphicalPropertyTypes.LEFT_WIDTH].value)
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 0
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.BOTTOM_WIDTH].value
                    *-1*parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                l ${(+this.config.graphicalProperties[GraphicalPropertyTypes.WIDTH].value - +this.config.graphicalProperties[GraphicalPropertyTypes.RIGHT_WIDTH].value - 
                    +this.config.graphicalProperties[GraphicalPropertyTypes.LEFT_WIDTH].value)
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value)} 0
                l 0 ${+this.config.graphicalProperties[GraphicalPropertyTypes.BOTTOM_WIDTH].value
                    *parseInt(this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value)}
                `}
        />
    }
}


export default Room;