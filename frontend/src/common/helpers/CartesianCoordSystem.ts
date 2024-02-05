import ICanvasConfig from "../canvasConfig"
import ICoords from "../model/ICoords"

export const toCartesianCoordSystem = ({ x, y }: ICoords, canvasConfig: ICanvasConfig) =>
({
    x: -((canvasConfig.canvasWidth - canvasConfig.offsetX * 2) / 2 - x),
    y: ((canvasConfig.canvasHeight - canvasConfig.offsetY * 2) / 2 - y)
})
export const fromCartesianCoordSystem = ({ x, y }: ICoords, canvasConfig: ICanvasConfig) =>
({
    x: ((canvasConfig.canvasWidth - canvasConfig.offsetX * 2) / 2 + x),
    y: ((canvasConfig.canvasHeight - canvasConfig.offsetY * 2) / 2 - y)
})