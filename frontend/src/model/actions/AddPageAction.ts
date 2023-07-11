import { IMessage } from "../message/IMessage";
import Project from "../projectData/Project";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class AddPageAction implements IAction {
    uid: string;
    storeHistory: boolean = true;
    
    private currentProject: Project;
    private name: string | null = null;
    private pageId: string | undefined;

    constructor(currentProject: Project, name?: string) {
        this.currentProject = currentProject;
        name && (this.name = name);
        this.uid = (+new Date).toString(36).slice(-5);
    } 

    undo(): IMessage {
        return {
            type: ActionType.DELETE_PAGE,
            pageId: this.pageId,
        }
    }

    do(): IMessage {
        return {
            type: ActionType.ADD_PAGE,
            uid: this.uid,
            data: {
                newPage: {
                    name: this.name ?? '',
                },
            }
        }
    }

    setPageId(id: string){
        this.pageId = id
    }
}