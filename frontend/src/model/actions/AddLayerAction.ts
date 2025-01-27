import { IMessage } from "../message/IMessage";
import Page from "../projectData/Page";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class AddLayerAction implements IAction {
    uid: string;
    storeHistory: boolean = true;
    
    private currentPage: Page;
    private name: string | null = null;
    private defaultName: string | null = null;
    private layerId: string | undefined;

    constructor(currentPage: Page, name?: string, defaultName?: string) {
        this.currentPage = currentPage;
        name && (this.name = name);
        defaultName && (this.defaultName = defaultName)
        this.uid = (+new Date).toString(36).slice(-5);
    }

    undo(): IMessage {
        return {
            type: ActionType.DELETE_LAYER,
            layerId: this.layerId,
        }
    }

    do(): IMessage {
        return {
            type: ActionType.ADD_LAYER,
            uid: this.uid,
            pageId: this.currentPage.getID(),
            data: {
                newLayer: {
                    name: this.name ?? '',
                    shapes: [],
                },
                defaultName: this.defaultName ?? 'Layer'
            }
        }
    }

    setLayerId(id: string){
        this.layerId = id;
    }
}