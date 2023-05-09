import titleUniqueization from "../../common/helpers/titleUniquezation";
import { IMessage } from "../message/IMessage";
import Page from "../projectData/Page";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class AddLayerAction implements IAction {
    private currentPage: Page;

    constructor(currentPage: Page) {
        this.currentPage = currentPage;
    }

    do(): boolean {
        return true;
    }

    undo(): void {
        // this.currentPage
    }

    getMessage(): IMessage {
        return {
            type: ActionType.ADD_LAYER,
            pageId: this.currentPage.getID(),
            data: {
                newLayer: {
                    name: titleUniqueization('Layer', this.currentPage.getLayers()),
                    zIndex: this.currentPage.getLayers().length * 1000,
                }
            }
        }
    }
}