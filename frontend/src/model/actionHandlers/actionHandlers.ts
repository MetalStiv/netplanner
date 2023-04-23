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

    handle(project: Project, message: IMessage){
        let result: Project = new Project(project.shapesGroups, "project", project.id);
        if (project.pages){
            result.setPages(project.getPages());
            result.pages.forEach(p => p.setCurrentLayer(
                project.pages.find(page => page.id === p.id)?.getCurrentLayer().id!
            ));
            project.getCurrentPage() && result.setCurrentPage(project.getCurrentPage().id);
        }

        this.handlers.forEach(async handler => {
            result = await handler(result, message);
        })
        return Promise.resolve(result);
    }
}

export default actionHandlers;