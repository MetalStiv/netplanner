import { ActionType } from "../actions/ActionType";
import { ConnectionPointTypes, calculateCPCoords, connectionPointsInflaters } from "../shapes/IConnectionPoint";
import { ActionHandler } from "./actionHandlers";

export const changeConnectionPointsHandler: ActionHandler = async (project, message) => {
    if (message.type !== ActionType.CHANGE_CONNECTION_POINTS) {
        return project;
    };

    console.log(message)

    const searchedShapes = message.data!.shapesIds!.map(shapeId =>
        project.getCurrentPage().getLayers().flatMap(layer => layer.getShapes()).find(shape => shape.config.id === shapeId)
    )
    // const searchedShapes = message.shapesGroup!.map(({ shape, layer }) =>
    //     project.getCurrentPage()
    //         ?.getLayers().find(l => l.getID() === layer)
    //         ?.getShapes().find(s => s.config.id! === shape)
    // );

    // if (searchedShape)
    //     searchedShape.updateObjectProperties(message.data!.objectProperties!)
    if (searchedShapes.length) {
        searchedShapes.forEach((shape, i) => {
            const connectionPoints = message.data!.connectionPoints![i].map(point => {
                const pointObj = connectionPointsInflaters.inflate(point, shape!.overallWidth, shape!.overallHeight);
                console.log(point, pointObj)
                return pointObj!;

                // const type: ConnectionPointTypes = ConnectionPointTypes[point.type as keyof typeof ConnectionPointTypes];
                // const { relativeCoords, markerOffset } = calculateCPCoords(type, 120, 80);
                // return ({
                //     ...point,
                //     type,
                //     relativeCoords,
                //     markerOffset,
                //     connectionAreaRadius: 10,
                // })
            });
            shape!.config.connectionPoints! = connectionPoints;
            // shape!.config.connectionPoints = message.data!.connectionPoints[i]
        })
        // searchedShapes[0]!.config.connectionPoints = message.data!.connectionPoints!;
        // searchedShapes[1]!.config.connectionPoints = message.data!.secondShapeConnectionPoints!;
    }

    project.setIsLoading(false);
    return project;
}