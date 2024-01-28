import { ShapeType } from "./ShapeType";
import { EditorType } from "../EditorType";
import { IMessageProperty } from "../message/IMessageShape";
import IConnectionPoint from "./IConnectionPoint";

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
    SHOW_ROOM_NUMBER = 'n',

    STROKE_COLOR = 'sc',
    STROKE_WIDTH = 'sw',
    STROKE_DASH = 'sd',

    FILL_TYPE = 'ft',
    FILL_COLOR_ONE = 'fc',
    FILL_COLOR_TWO = 'fc2',
    FILL_HATCHING_SPACE = 'fh',
    FILL_HATCHING_DASH = 'fd',

    STEP_QUANTITY = 'sq',
    DIRECTION = 'd',

    MIRROR_X = 'mx',
    MIRROR_Y = 'my',
}

export enum ObjectPropertyTypes {
    ID = 'l1',
    OS = 's1',
    CPU = 'h1',
    RAM = 'h2',
    IP = 'n1',
    MAC = 'n2',
    HOST_NAME = 'l2',
    MANUFACTURER = 'l3',
    MODEL = 'l4',
    SSID = 'l5',
    CONTACT_PERSON = 'l6',
    SOFTWARE = 'l7',
    ROOM_NUMBER = 'l8',
    TEXT = 't',
}

export interface IShapeGraphicalProps {
    [GraphicalPropertyTypes.X]: IGraphicalProperty,
    [GraphicalPropertyTypes.Y]: IGraphicalProperty,
    [GraphicalPropertyTypes.PIVOT]: IGraphicalProperty,
    [GraphicalPropertyTypes.MIRROR_X]: IGraphicalProperty,
    [GraphicalPropertyTypes.MIRROR_Y]: IGraphicalProperty,
}

export interface IShapeObjectProps {
    [ObjectPropertyTypes.ID]: IObjectProperty,
}

export interface IGraphicalProperty {
    value: string | string[],
    isReadable: boolean,
    editorType: EditorType
}

export interface IObjectProperty {
    value: string | string[],
    editorType: EditorType
}

export interface IShapeConfig {
    id?: string,
    graphicalProperties: IShapeGraphicalProps,
    objectProperties: IShapeObjectProps,
    zIndex?: number,
    connectionPoints?: IConnectionPoint[]
}

export interface IShape {
    type: ShapeType,
    config: IShapeConfig,
    isVisible: boolean,
    overallWidth: number,
    overallHeight: number,
    isSelected?: boolean,
    validateProperty: (value: string, propertyType: GraphicalPropertyTypes) => string,
    updateObjectProperties: (m: IMessageProperty[]) => void,
    updateGraphicalProperties: (m: IMessageProperty[]) => void,
    render(handlerMouseDown: (e: React.PointerEvent<SVGGeometryElement>) => void,
        // handlerFocus: (e: React.FocusEvent<SVGGeometryElement> | React.PointerEvent<SVGGeometryElement> | undefined) => void,
        handlerBlur: (e: React.FocusEvent<SVGGeometryElement>) => void,
        layerZIndex: number,
        isSelected?: boolean): JSX.Element;
}

export default IShape;