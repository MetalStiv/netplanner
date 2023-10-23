import IShapeCreator from "../IShapeCreator";
import { ShapeType } from "../ShapeType";
import IShape, { GraphicalPropertyTypes, IGraphicalProperty, IShapeConfig, IShapeGraphicalProps, ObjectPropertyTypes } from "../IShape";
import { TShapeInflater } from "../shapeInflaters";
import { IMessageProperty, IMessageShape } from "../../message/IMessageShape";
import { EditorType } from "../../EditorType";

interface IEllipseGraphicalProps extends IShapeGraphicalProps {
    [GraphicalPropertyTypes.STROKE_COLOR]: IGraphicalProperty,
    [GraphicalPropertyTypes.FILL_COLOR_ONE]: IGraphicalProperty,
    [GraphicalPropertyTypes.RX]: IGraphicalProperty,
    [GraphicalPropertyTypes.RY]: IGraphicalProperty,
}

interface IEllipseConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: IEllipseGraphicalProps,
    zIndex: number,
}

export const ellipseInflater: TShapeInflater = async (messageShape: IMessageShape) => {
    if (messageShape.type !== ShapeType.ELLIPS) {
        return null
    }
    return new Ellipse({
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
            [GraphicalPropertyTypes.RX]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.RX)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.RY]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.RY)!.v,
                isReadable: true,
                editorType: EditorType.TEXT_EDITOR
            },
            [GraphicalPropertyTypes.STROKE_COLOR]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.STROKE_COLOR)!.v,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
            },
            [GraphicalPropertyTypes.FILL_COLOR_ONE]: {
                value: messageShape.graphicalProperties.find(p => p.l === GraphicalPropertyTypes.FILL_COLOR_ONE)!.v,
                isReadable: true,
                editorType: EditorType.COLOR_EDITOR
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
        },
        objectProperties: {
            [ObjectPropertyTypes.ID]: {
                value: messageShape.objectProperties ?
                    messageShape.objectProperties.find(p => p.l === ObjectPropertyTypes.ID) ?
                    messageShape.objectProperties.find(p => p.l === ObjectPropertyTypes.ID)!.v : ''
                    : '',
                editorType: EditorType.TEXT_EDITOR
            },
        },
    })
}

export class EllipseCreator implements IShapeCreator {
    type: ShapeType = ShapeType.ELLIPS;
    icon: string = '<ellipse cx="14" cy="10" rx="12" ry="8" fill="white" stroke="black" stroke-width="2"/>';
    create() {
        return new Ellipse({
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
                [GraphicalPropertyTypes.RX]: {
                    value: '30',
                    isReadable: true,
                    editorType: EditorType.TEXT_EDITOR
                },
                [GraphicalPropertyTypes.RY]: {
                    value: '20',
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
            objectProperties: {
                [ObjectPropertyTypes.ID]: {
                    value: '',
                    editorType: EditorType.TEXT_EDITOR
                },
            },
            zIndex: 0,
        });
    }
}

class Ellipse implements IShape {
    type: ShapeType = ShapeType.ELLIPS;
    config: IEllipseConfig;
    isVisible: boolean = true;
    zIndex: number = 0;

    get overallWidth() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.RX].value * 2;
    }
    set overallWidth(value: number) {
        const newRadius = value / 2;
        this.config.graphicalProperties[GraphicalPropertyTypes.RX].value =
            this.validateProperty(newRadius.toString(), GraphicalPropertyTypes.RX);
    }
    get overallHeight() {
        return +this.config.graphicalProperties[GraphicalPropertyTypes.RY].value * 2;
    }
    set overallHeight(value: number) {
        const newRadius = value / 2;
        this.config.graphicalProperties[GraphicalPropertyTypes.RY].value =
            this.validateProperty(newRadius.toString(), GraphicalPropertyTypes.RY);
    }

    validateProperty(value: string, propertyType: GraphicalPropertyTypes) {
        let validValue = value;
        switch (propertyType) {
            case GraphicalPropertyTypes.RX:
            case GraphicalPropertyTypes.RY:
                if (+validValue < 5) {
                    validValue = '5';
                }
                break;

            default:
                break;
        }
        return validValue;
    }

    constructor(obj: IEllipseConfig) {
        this.config = obj;
        this.zIndex = obj.zIndex ?? 0;
    }

    updateObjectProperties(m: IMessageProperty[]) {
        this.config.objectProperties[ObjectPropertyTypes.ID] = {
            value: m.find(p => p.l === ObjectPropertyTypes.ID)!.v,
            editorType: EditorType.TEXT_EDITOR
        };
    }
    
    updateGraphicalProperties(m: IMessageProperty[]) {
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
        this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.PIVOT)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.RX] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.RX)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.RY] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.RY)!.v,
            isReadable: true,
            editorType: EditorType.TEXT_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.FILL_COLOR_ONE)!.v,
            isReadable: true,
            editorType: EditorType.COLOR_EDITOR
        };
        this.config.graphicalProperties[GraphicalPropertyTypes.STROKE_COLOR] = {
            value: m.find(p => p.l === GraphicalPropertyTypes.STROKE_COLOR)!.v,
            isReadable: true,
            editorType: EditorType.COLOR_EDITOR
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
            stroke={this.config.graphicalProperties[GraphicalPropertyTypes.STROKE_COLOR].value.toString() ?? 'black'}
            fill={this.config.graphicalProperties[GraphicalPropertyTypes.FILL_COLOR_ONE].value.toString() ?? 'black'}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + +layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            // onFocus={handlerFocus}
            onBlur={handlerBlur}
            transform={`rotate(${
                this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y]!.value === this.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X]!.value
                    ? +this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value
                    : 360-+this.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value}
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.X].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.RX].value)} 
                ${+this.config.graphicalProperties[GraphicalPropertyTypes.Y].value + (+this.config.graphicalProperties[GraphicalPropertyTypes.RY].value)})
                `}
            d={`
                M ${(+this.config.graphicalProperties[GraphicalPropertyTypes.X].value) +
                (+this.config.graphicalProperties[GraphicalPropertyTypes.RX].value)},${this.config.graphicalProperties[GraphicalPropertyTypes.Y].value}
                a ${this.config.graphicalProperties[GraphicalPropertyTypes.RX].value},${this.config.graphicalProperties[GraphicalPropertyTypes.RY].value}
                0
                1,0
                1,0
                z
            `}
        />
    }
}


export default Ellipse;