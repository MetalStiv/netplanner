import { ActionType } from "../actions/ActionType";
import { ActionHandler } from "./actionHandlers";

export const changeGraphicalPropertyHandler: ActionHandler = async (project, message) => {
    if (message.type !== ActionType.CHANGE_GRAPHICAL_PROPERTY) {
        return project;
    };

    console.log(message)

    const searchedShape = project.getCurrentPage()
        ?.getLayers().find(layer => layer.getID() === message.layerId)
        ?.getShapes().find(shape => shape.config.id! === message.shapeId);

    console.log(searchedShape)
    if (searchedShape)
        searchedShape.updateGraphicalProperties(message.data.graphicalProperties!)
    //     searchedShape.config.graphicalProperties = message.data.graphicalProperties!;

    project.setIsLoading(false);
    return project;
}