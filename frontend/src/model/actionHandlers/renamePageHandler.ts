import { ActionHandler } from "./actionHandlers";
import { ActionType } from "../actions/ActionType";
import Page from "../projectData/Page";

export const renamePageHandler: ActionHandler = async (project, message) => {
    if (message.type !== ActionType.RENAME_PAGE) {
        return project;
    };

    const page: Page | undefined = project.getPages().find(p => p.getID() === message.pageId)
    page?.setTitle(message.data?.name!)

    project.setIsLoading(false);
    return project;
}