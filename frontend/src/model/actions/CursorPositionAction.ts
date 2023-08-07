import { IMessage } from "../message/IMessage";
import Page from "../projectData/Page";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class CursorPositionAction implements IAction {
    uid: string;
    storeHistory: boolean = false;
    
    private currentPage: Page;
    private cursorCoords: { x: number, y: number };

    constructor(currentPage: Page, cursorCoords: { x: number, y: number }) {
        this.currentPage = currentPage;
        this.cursorCoords = cursorCoords;
        this.uid = (+new Date).toString(36).slice(-5);
    }

    undo(): IMessage {
        return {
            type: ActionType.CURSOR_POSITION,
            pageId: this.currentPage.getID(),
            data: {
                coords: {
                    x: this.cursorCoords.x,
                    y: this.cursorCoords.y
                }
            }
        }
    }

    do(): IMessage {
        return {
            type: ActionType.CURSOR_POSITION,
            pageId: this.currentPage ? this.currentPage.getID() : '',
            data: {
                coords: {
                    x: this.cursorCoords.x,
                    y: this.cursorCoords.y
                }
            }
        }
    }
}