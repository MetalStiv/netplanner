import { ActionType } from "../actions/ActionType";
import { ActionHandler } from "./actionHandlers";

export const deleteLayerHandler: ActionHandler = async (project, message) => {
    if (message.type !== ActionType.DELETE_LAYER) {
        return project;
    };
    
    const currentPage = project.getPages().find(p => p.getLayers().map(l => l.getID()).includes(message.layerId!))
    if (!currentPage?.getLayers().filter(l => l.getID() !== message.layerId)[0]){
        return project
    }
    if (currentPage.getLayers().find(l => l.getID() === message.layerId)?.isCurrent()){
        currentPage?.getLayers().filter(l => l.getID() !== message.layerId)[0].setIsCurrent(true)
    }
    
    project.getPages().forEach(p => p.removeLayerById(message.layerId!))

    project.setIsLoading(false);
    return project;
}