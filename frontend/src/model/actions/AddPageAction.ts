import titleUniqueization from "../../common/helpers/titleUniquezation";
import { IMessage } from "../message/IMessage";
// import Page from "../projectData/Page";
import Project from "../projectData/Project";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class AddPageAction implements IAction {
    private currentProject: Project;

    constructor(currentProject: Project) {
        this.currentProject = currentProject;
    }

    do(): boolean {
        return true;
    }

    undo(): void {
        // this.currentPage
    }

    getMessage(): IMessage {
        return {
            type: ActionType.ADD_PAGE,
            data: {
                newPage: {
                    name: titleUniqueization('Page', this.currentProject.getPages()),
                    layers: [{
                        name: 'Layer',
                        zIndex: 1,
                    }]
                },
            }
        }
    }
}