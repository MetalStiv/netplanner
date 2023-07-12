import { ActionType } from "../actions/ActionType";
import { ActionHandler } from "./actionHandlers";

export const deletePageHandler: ActionHandler = async (project, message) => {
    if (message.type !== ActionType.DELETE_PAGE) {
        return project;
    };

    project.setIsLoading(false);
    if (!project.getPages().filter(p => p.getID() !== message.pageId)[0]){
        return project
    }
    if (project.getPages().find(p => p.getID() === message.pageId)?.isCurrent()){
        project.setCurrentPage(project.getPages().filter(p => p.getID() !== message.pageId)[0].getID())
    }

    project.deletePageById(message.pageId!);
    return project;
}