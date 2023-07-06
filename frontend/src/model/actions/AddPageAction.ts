// import titleUniqueization from "../../common/helpers/titleUniquezation";
import { IMessage } from "../message/IMessage";
// import Page from "../projectData/Page";
import Project from "../projectData/Project";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class AddPageAction implements IAction {
    storeHistory: boolean = true;
    
    private currentProject: Project;
    private name: string | null = null;

    constructor(currentProject: Project, name?: string) {
        this.currentProject = currentProject;
        name && (this.name = name);
    }

    undo(): void {
        // this.currentPage
    }

    do(): IMessage {
        return {
            type: ActionType.ADD_PAGE,
            data: {
                newPage: {
                    name: this.name ?? '',
                    // name: titleUniqueization('Page', this.currentProject.getPages()),
                    // layers: [{
                    //     name: 'Layer',
                    //     zIndex: 1,
                    // }]
                },
            }
        }
    }
}