export interface IMessageShape {
    id?: string,
    type: string,
    zIndex: number,
    isVisible: boolean,
    graphicalProperties: {
        x: string,
        y: string,
        x2?: string,
        y2?: string,
        r?: string,
        rx?: string,
        ry?: string,
        width?: string,
        height?: string,
        pivot: string,
        leftWidth?: string,
        rightWidth?: string,
        topWidth?: string,
        bottomWidth?: string,

        strokeColor?: string,
        strokeWidth?: string,
        strokeDash?: string,

        fillType?: string,
        fillColorOne?: string,
        fillColorTwo?: string,
        fillHatchingSpace?: string,
        fillHatchingDash?: string,
    }
}