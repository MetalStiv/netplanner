// import titleUniqueization from "../../common/helpers/titleUniquezation";
import { IMessage } from "../message/IMessage";
import Page from "../projectData/Page";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class AddLayerAction implements IAction {
    storeHistory: boolean = true;
    
    private currentPage: Page;
    private name: string | null = null;

    constructor(currentPage: Page, name?: string) {
        this.currentPage = currentPage;
        name && (this.name = name);
    }

    undo(): void {
        // this.currentPage
    }

    do(): IMessage {
        return {
            type: ActionType.ADD_LAYER,
            pageId: this.currentPage.getID(),
            data: {
                newLayer: {
                    name: this.name ?? '',
                    // name: titleUniqueization('Layer', this.currentPage.getLayers()),
                    // zIndex: this.currentPage.getLayers().length * 1000,
                }
            }
        }
    }
}