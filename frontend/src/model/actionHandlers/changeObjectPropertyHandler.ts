import { ActionType } from "../actions/ActionType";
import { ActionHandler } from "./actionHandlers";

export const changeObjectPropertyHandler: ActionHandler = async (project, message) => {
    if (message.type !== ActionType.CHANGE_OBJECT_PROPERTY) {
        return project;
    };

    console.log(message)

    const searchedShape = project.getCurrentPage()
        ?.getLayers().find(layer => layer.getID() === message.layerId)
        ?.getShapes().find(shape => shape.config.id! === message.shapeId);

    if (searchedShape)
        searchedShape.updateObjectProperties(message.data!.objectProperties!)

    project.setIsLoading(false);
    return project;
}