// import titleUniqueization from "../../common/helpers/titleUniquezation";
import { IMessage } from "../message/IMessage";
import Layer from "../projectData/Layer";
import Page from "../projectData/Page";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class ChangeLayerVisibleAction implements IAction {
    storeHistory: boolean = true;
    
    private layer: Layer;
    private prevVal: boolean;
    private newVal: boolean;

    constructor(layer: Layer, newVal: boolean) {
        this.layer = layer;
        this.prevVal = layer.isVisible();
        this.newVal = newVal;
    }

    do(): IMessage {
        return {
            type: ActionType.CHANGE_LAYER_VISIBLE,
            layerId: this.layer.getID(),
            data: {
                isVisible: this.newVal
            }
        }
    }

    undo(): IMessage {
        return {
            type: ActionType.CHANGE_LAYER_VISIBLE,
            layerId: this.layer.getID(),
            data: {
                isVisible: this.newVal
            }
        }
    }
}