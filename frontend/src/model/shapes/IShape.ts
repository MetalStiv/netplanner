import { ShapeType } from "./ShapeType";
import { EditorType } from "../EditorType";
import { IMessageGraphicalProperty } from "../message/IMessageShape";

export enum GraphicalPropertyTypes {
    X = 'x',
    Y = 'y',
    X2 = 'x2',
    Y2 = 'y2',
    R = 'r',
    RX = 'rx',
    RY = 'ry',
    WIDTH = 'w',
    HEIGHT = 'h',
    PIVOT = 'p',
    LEFT_WIDTH = 'lw',
    RIGHT_WIDTH = 'rw',
    TOP_WIDTH = 'tw',
    BOTTOM_WIDTH = 'bw',

    STROKE_COLOR = 'sc',
    STROKE_WIDTH = 'sw',
    STROKE_DASH = 'sd',

    FILL_TYPE = 'ft',
    FILL_COLOR_ONE = 'fc',
    FILL_COLOR_TWO = 'fc2',
    FILL_HATCHING_SPACE = 'fh',
    FILL_HATCHING_DASH = 'fd',

    STEP_QUANTITY = 'sq',

    MIRROR_X = 'mx',
    MIRROR_Y = 'my',
}

export interface IShapeGraphicalProps {
    [GraphicalPropertyTypes.X]: IGraphicalProperty,
    [GraphicalPropertyTypes.Y]: IGraphicalProperty,
    [GraphicalPropertyTypes.PIVOT]: IGraphicalProperty,
    [GraphicalPropertyTypes.MIRROR_X]: IGraphicalProperty,
    [GraphicalPropertyTypes.MIRROR_Y]: IGraphicalProperty,
}

export interface IGraphicalProperty {
    value: string,
    isReadable: boolean,
    editorType: EditorType
}

export interface IShapeConfig {
    id?: string,
    graphicalProperties: IShapeGraphicalProps,
    zIndex?: number
}

export interface IShape {
    type: ShapeType,
    config: IShapeConfig,
    isVisible: boolean,
    overallWidth: number,
    overallHeight: number,
    isSelected?: boolean,
    updateGraphicalProperties: (m: IMessageGraphicalProperty[]) => void,
    render(handlerMouseDown: (e: React.PointerEvent<SVGGeometryElement>) => void,
        // handlerFocus: (e: React.FocusEvent<SVGGeometryElement> | React.PointerEvent<SVGGeometryElement> | undefined) => void,
        handlerBlur: (e: React.FocusEvent<SVGGeometryElement>) => void,
        layerZIndex: number,
        isSelected?: boolean): JSX.Element;
}

export default IShape;