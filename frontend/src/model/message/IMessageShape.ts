import { IGraphicalProperty } from "../shapes/IShape";

export interface IMessageShape {
    id?: string,
    type: string,
    graphicalProperties: {
        x: IGraphicalProperty,
        y: IGraphicalProperty,
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