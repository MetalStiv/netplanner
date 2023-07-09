import { IMessage } from "../message/IMessage";
import Layer from "../projectData/Layer";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class RenameLayerAction implements IAction {
    uid: string;
    storeHistory: boolean = true;
    
    private layer: Layer;
    private newName: string;
    private oldName: string;

    constructor(layer: Layer, newName: string) {
        this.layer = layer;
        this.newName = newName;
        this.oldName = layer.getTitle()
        this.uid = (+new Date).toString(36).slice(-5);
    }

    undo(): IMessage {
        return {
            type: ActionType.RENAME_LAYER,
            uid: this.uid,
            layerId: this.layer.getID(),
            data: {
                name: this.oldName
            }
        }
    }

    do(): IMessage {
        return {
            type: ActionType.RENAME_LAYER,
            uid: this.uid,
            layerId: this.layer.getID(),
            data: {
                name: this.newName
            }
        }
    }
}