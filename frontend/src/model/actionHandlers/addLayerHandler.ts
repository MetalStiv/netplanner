import { ActionType } from "../actions/ActionType";
import Layer from "../projectData/Layer";
import { ActionHandler } from "./actionHandlers";

export const addLayerHandler: ActionHandler = async (project, message) => {
    if (message.type !== ActionType.ADD_LAYER) {
        return project;
    };
    const newLayer: Layer =
        new Layer(message.data!.newLayer!.id,
            message.data!.newLayer!.zIndex!,
            message.data!.newLayer!.name,
            []);

    if (newLayer) {
        project.getPages().find(p => p.getID() === message.pageId)
            ?.addLayer(newLayer)
    }

    project.setIsLoading(false);
    return project;
}