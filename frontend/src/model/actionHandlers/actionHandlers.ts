import { IMessage } from "../IMessage";
import Project from "../Project";
import { addShapeHandler } from "./addShapeHandler";
import { openProjectHandler } from "./openProjectHandler";

export type ActionHandler = (project: Project, message: IMessage) => Promise<Project>

export interface IActionHandlers {
    handlers: ActionHandler[],
    handle: (project: Project, message: IMessage) => Promise<Project>
}

export const actionHandlers: IActionHandlers = {
    handlers: new Array(
        openProjectHandler,
        addShapeHandler
    ),

    async handle(project: Project, message: IMessage){
        let result: Project = new Project(project.shapesGroups, project.title, project.id);
        result.isLoading = true;
        if (project.pages){
            result.setPages(project.getPages());
            result.pages.forEach(p => p.setCurrentLayer(
                project.pages.find(page => page.id === p.id)?.getCurrentLayer().id!
            ));
            project.getCurrentPage() && result.setCurrentPage(project.getCurrentPage().id);
        }

        await this.handlers.every(async handler => {
            result = await handler(result, message);
            if (result.isLoading === true){
                return (false);
            }
            return true;
        })

        return result;
    }
}

export default actionHandlers;