import ICanvasConfig from "../canvasConfig"

export const toCartesianCoordSystem = ({ x, y }: { x: number, y: number }, canvasConfig: ICanvasConfig) =>
({
    x: -((canvasConfig.canvasWidth - canvasConfig.offsetX * 2) / 2 - x),
    y: ((canvasConfig.canvasHeight - canvasConfig.offsetY * 2) / 2 - y)
})
export const fromCartesianCoordSystem = ({ x, y }: { x: number, y: number }, canvasConfig: ICanvasConfig) =>
({
    x: ((canvasConfig.canvasWidth - canvasConfig.offsetX * 2) / 2 + x),
    y: ((canvasConfig.canvasHeight - canvasConfig.offsetY * 2) / 2 - y)
})