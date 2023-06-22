import IShapeCreator from "../IShapeCreator";
import { TShapeInflater } from "../shapeInflaters";
import { ShapeType } from "../ShapeType";
import IShape, { IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";
import { IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface IWallProps extends IShapeGraphicalProps {
    width: IGraphicalProperty,
    height: IGraphicalProperty,
    fillColorOne: IGraphicalProperty,
}

export interface IWallConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: IWallProps,
    zIndex: number,
}

export const wallInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.WALL) {
        return null
    }
    return new Wall({
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

export class WallCreator implements IShapeCreator {
    type: ShapeType = ShapeType.WALL;
    create() {
        return new Wall({
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
                    value: '600',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                height: {
                    label: 'Height',
                    value: '20',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                fillColorOne: {
                    label: 'Fill Color One',
                    value: '#000000',
                    isReadable: true,
                    editorType: EditorType.COLOR_EDITOR
                }
            },
            zIndex: 0,
        });
    }
}

class Wall implements IShape {
    type: ShapeType = ShapeType.WALL;
    config: IWallConfig;
    isVisible: boolean = true;

    constructor(obj: IWallConfig) {
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
                l ${this.config.graphicalProperties.width.value} 0
                l 0 -${this.config.graphicalProperties.height.value}
                l -${this.config.graphicalProperties.width.value} 0
                `}
        />
    }
}


export default Wall;