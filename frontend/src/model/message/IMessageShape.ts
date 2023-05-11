import { IGraphicalProperty } from "../shapes/IShape";

export interface IMessageShape {
    id?: string,
    type: string,
    zIndex: number,
    graphicalProperties: {
        x: IGraphicalProperty,
        y: IGraphicalProperty,
        x2?: IGraphicalProperty,
        y2?: IGraphicalProperty,
        r?: IGraphicalProperty,
        rx?: IGraphicalProperty,
        ry?: IGraphicalProperty,
        width?: IGraphicalProperty,
        height?: IGraphicalProperty,
        pivot?: IGraphicalProperty,

        strokeColor?: IGraphicalProperty,
        strokeWidth?: IGraphicalProperty,
        strokeDash?: IGraphicalProperty,

        fillType?: IGraphicalProperty,
        fillColorOne?: IGraphicalProperty,
        fillColorTwo?: IGraphicalProperty,
        fillHatchingSpace?: IGraphicalProperty,
        fillHatchingDash?: IGraphicalProperty,
    }
}