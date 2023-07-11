import { IMessage } from "../message/IMessage";
import { ILayer } from "../projectData/Layer";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class DeleteLayerAction implements IAction {
    uid: string;
    storeHistory: boolean = true;

    private layer: ILayer;
    private pageId: string;

    constructor(layer: ILayer, pageId: string) {
        this.layer = layer;
        this.pageId = pageId;
        this.uid = (+new Date).toString(36).slice(-5);
    }

    undo(): IMessage {
        return {
            type: ActionType.ADD_LAYER,
            pageId: this.pageId,
            data: {
                newLayer: {
                    name: this.layer.getTitle(),
                    zIndex: this.layer.getZIndex(),
                    isVisible: this.layer.isVisible(),
                    shapes: this.layer.getShapes().map(s => {
                        const messageProperties: {l: string, v: string}[] = []
                        let graphicalProperty: keyof typeof s.config.graphicalProperties; 
                        for (graphicalProperty in s.config.graphicalProperties){
                            messageProperties.push({l: graphicalProperty, 
                                v: s.config.graphicalProperties[graphicalProperty].value})
                        }

                        return {
                            id: s.config.id,
                            type: s.type,
                            zIndex: s.config.zIndex!,
                            graphicalProperties: messageProperties,
                        }
                    }),
                }
            }
        }
    }

    do(): IMessage {
        return {
            type: ActionType.DELETE_LAYER,
            layerId: this.layer.getID(),
        }
    }
}