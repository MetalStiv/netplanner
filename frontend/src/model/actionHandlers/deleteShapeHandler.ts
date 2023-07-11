import { ActionType } from "../actions/ActionType";
import { ActionHandler } from "./actionHandlers";

export const deleteShapeHandler: ActionHandler = async (project, message) => {
    if (message.type !== ActionType.DELETE_SHAPE) {
        return project;
    };
    
    project.getPages().forEach(p => p.getLayers()
        .forEach(l => l.removeShapeById(message.shapeId!)))

    project.setIsLoading(false);
    return project;
}