import { ActionHandler } from "./actionHandlers";
import { ActionType } from "../actions/ActionType";
import Layer from "../projectData/Layer";

export const renameLayerHandler: ActionHandler = async (project, message) => {
    if (message.type !== ActionType.RENAME_LAYER) {
        return project;
    };

    let layer: Layer | undefined;
    project.getPages().forEach(p => p.getLayers()
        .forEach(l => {
            if (l.getID() === message.layerId)
                layer = l
        }))
    layer?.setTitle(message.data?.name!)

    project.setIsLoading(false);
    return project;
}