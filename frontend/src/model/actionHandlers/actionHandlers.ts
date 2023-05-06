import { IMessage } from "../message/IMessage";
import Project from "../projectData/Project";
import { addShapeHandler } from "./addShapeHandler";
import { changeGraphicalPropertyHandler } from "./changeGraphicalPropertyHandler";
import { openProjectHandler } from "./openProjectHandler";

export type ActionHandler = (project: Project, message: IMessage) => Promise<Project>

export interface IActionHandlers {
    handlers: ActionHandler[],
    handle: (project: Project, message: IMessage) => Promise<Project>
}

export const actionHandlers: IActionHandlers = {
    handlers: new Array(
        openProjectHandler,
        addShapeHandler,
        changeGraphicalPropertyHandler
    ),

    async handle(project: Project, message: IMessage) {
        let result: Project = new Project(project.shapesGroups, project.title, project.id);
        result.isLoading = true;
        if (project.pages) {
            result.setPages(project.getPages());
            result.pages.forEach(p => p.setCurrentLayer(
                project.pages.find(page => page.getID() === p.getID())?.getCurrentLayer().getID()!
            ));
            project.getCurrentPage() && result.setCurrentPage(project.getCurrentPage().getID());
        }

        await this.handlers.every(async handler => {
            result = await handler(result, message);
            if (result.isLoading === true) {
                return false;
            }
            return true;
        })

        return result;
    }
}

export default actionHandlers;