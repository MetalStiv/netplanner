import { IMessage } from "../message/IMessage";
import Project from "../projectData/Project";
import { addLayerHandler } from "./addLayerHandler";
import { addPageHandler } from "./addPageHandler";
import { addShapeHandler } from "./addShapeHandler";
import { changeGraphicalPropertyHandler } from "./changeGraphicalPropertyHandler";
import { cursorPositionHandler } from "./cursorPositionHandler";
import { openProjectHandler } from "./openProjectHandler";

export type ActionHandler = (project: Project, message: IMessage) => Promise<Project>

export interface IActionHandlers {
    handlers: ActionHandler[],
    handle: (project: Project, message: IMessage) => Promise<Project>
}

export const actionHandlers: IActionHandlers = {
    handlers: [
        cursorPositionHandler,
        openProjectHandler,
        addShapeHandler,
        addLayerHandler,
        addPageHandler,
        changeGraphicalPropertyHandler
    ],

    async handle(project: Project, message: IMessage) {
        let result: Project = new Project(project.getShapesGroups(), project.getTitle(), project.getID());
        result.setIsLoading(true);
        if (project.getPages()) {
            result.setPages(project.getPages());
            result.getPages().forEach(p => p.setCurrentLayer(
                project.getPages().find(page => page.getID() === p.getID())?.getCurrentLayer().getID()!
            ));
            project.getCurrentPage() && result.setCurrentPage(project.getCurrentPage().getID());
            result.setCursors(project.getCursors());
        }

        this.handlers.every(async handler => {
            result = await handler(result, message);
            if (result.isLoading() === true) {
                return false;
            }
            return true;
        })

        return result;
    }
}

export default actionHandlers;