import { IMessage } from "../message/IMessage";
import Page from "../projectData/Page";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class RenamePageAction implements IAction {
    uid: string;
    storeHistory: boolean = true;
    
    private page: Page;
    private newName: string;
    private oldName: string;

    constructor(page: Page, newName: string) {
        this.page = page;
        this.newName = newName;
        this.oldName = page.getTitle();
        this.uid = (+new Date).toString(36).slice(-5);
    }

    undo(): IMessage {
        return {
            type: ActionType.RENAME_PAGE,
            uid: this.uid,
            pageId: this.page.getID(),
            data: {
                name: this.oldName
            }
        }
    }

    do(): IMessage {
        return {
            type: ActionType.RENAME_PAGE,
            uid: this.uid,
            pageId: this.page.getID(),
            data: {
                name: this.newName
            }
        }
    }
}