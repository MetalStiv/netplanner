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
    project.setCurrentPage(project.getPages().filter(p => p.getID() !== message.pageId)[0].getID())
    console.log(project.getCurrentPage());
    
    project.deletePageById(message.pageId!);

    return project;
}