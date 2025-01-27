import { ActionType } from "../actions/ActionType";
import { ActionHandler } from "./actionHandlers";

export const changeLayerVisibleHandler: ActionHandler = async (project, message) => {
    if (message.type !== ActionType.CHANGE_LAYER_VISIBLE) {
        return project;
    };

    const layer = project.getPages().map(page => page.getLayers()).flat().find(layer => layer.getID() === message.layerId);
    layer?.changeVisible(message.data!.isVisible!);

    project.setIsLoading(false);
    return project;
}