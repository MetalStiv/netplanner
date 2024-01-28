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
                        const messageGraphicalProperties: { l: string, v: string | string[] }[] = []
                        let graphicalProperty: keyof typeof s.config.graphicalProperties;
                        for (graphicalProperty in s.config.graphicalProperties) {
                            messageGraphicalProperties.push({
                                l: graphicalProperty,
                                v: s.config.graphicalProperties[graphicalProperty].value
                            })
                        }

                        const messageObjectProperties: { l: string, v: string | string[] }[] = []
                        let objectProperty: keyof typeof s.config.objectProperties;
                        for (objectProperty in s.config.objectProperties) {
                            messageGraphicalProperties.push({
                                l: objectProperty,
                                v: s.config.objectProperties[objectProperty].value
                            })
                        }

                        return {
                            id: s.config.id,
                            type: s.type,
                            zIndex: s.config.zIndex!,
                            graphicalProperties: messageGraphicalProperties,
                            objectProperties: messageObjectProperties,
                            connectionPoints: s.config.connectionPoints ?? []
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