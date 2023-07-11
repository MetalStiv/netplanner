import { ActionType } from "../actions/ActionType";
import { ActionHandler } from "./actionHandlers";

export const deleteLayerHandler: ActionHandler = async (project, message) => {
    if (message.type !== ActionType.DELETE_LAYER) {
        return project;
    };
    
    project.getPages().forEach(p => p.removeLayerById(message.data?.newLayer?.id!))

    project.setIsLoading(false);
    return project;
}