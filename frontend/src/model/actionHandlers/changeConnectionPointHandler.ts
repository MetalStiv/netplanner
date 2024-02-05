import { ActionType } from "../actions/ActionType";
import { connectionPointsInflaters } from "../shapes/IConnectionPoint";
import { ActionHandler } from "./actionHandlers";

export const changeConnectionPointsHandler: ActionHandler = async (project, message) => {
    if (message.type !== ActionType.CHANGE_CONNECTION_POINTS) {
        return project;
    };

    console.log(message)

    const searchedShapes = message.data!.shapesIds!.map(shapeId =>
        project.getCurrentPage().getLayers().flatMap(layer => layer.getShapes()).find(shape => shape.config.id === shapeId)
    )
    if (searchedShapes.length) {
        searchedShapes.forEach((shape, i) => {
            const connectionPoints = message.data!.connectionPoints![i].map(point => {
                const pointObj = connectionPointsInflaters.inflate(point, shape!.overallWidth, shape!.overallHeight);
                console.log(point, pointObj)
                return pointObj!;
            });
            shape!.config.connectionPoints! = connectionPoints;
        })
    }

    project.setIsLoading(false);
    return project;
}