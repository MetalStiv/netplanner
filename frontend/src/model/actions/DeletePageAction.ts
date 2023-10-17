import { IMessage } from "../message/IMessage";
import { ILayer } from "../projectData/Layer";
import Page from "../projectData/Page";
import IShape from "../shapes/IShape";
import { ActionType } from "./ActionType";
import { IAction } from "./IAction";

export class DeletePageAction implements IAction {
    uid: string;
    storeHistory: boolean = true;

    private page: Page;

    constructor(page: Page) {
        this.page = page;
        this.uid = (+new Date).toString(36).slice(-5);
    }

    undo(): IMessage {
        return {
            type: ActionType.ADD_PAGE,
            pageId: this.page.getID(),
            data: {
                newPage: {
                    id: this.page.getID(),
                    name: this.page.getTitle(),
                    layers: this.page.getLayers().map(l => {return {
                        id: l.getID(),
                        name: l.getTitle(),
                        zIndex: l.getZIndex(),
                        isVisible: l.isVisible(),
                        shapes: l.getShapes().map(s => {
                            const messageGraphicalProperties: {l: string, v: string}[] = []
                            let graphicalProperty: keyof typeof s.config.graphicalProperties; 
                            for (graphicalProperty in s.config.graphicalProperties){
                                messageGraphicalProperties.push({l: graphicalProperty, 
                                    v: s.config.graphicalProperties[graphicalProperty].value})
                            }

                            const messageObjectProperties: {l: string, v: string}[] = []
                            let objectProperty: keyof typeof s.config.objectProperties; 
                            for (objectProperty in s.config.objectProperties){
                                messageObjectProperties.push({l: objectProperty, 
                                    v: s.config.objectProperties[objectProperty].value})
                            }
    
                            return {
                                id: s.config.id,
                                type: s.type,
                                zIndex: s.config.zIndex!,
                                graphicalProperties: messageGraphicalProperties,
                                objectProperties: messageObjectProperties,
                            }
                        }),
                    }})
                }
            }
        }
    }

    do(): IMessage {
        return {
            type: ActionType.DELETE_PAGE,
            pageId: this.page.getID(),
        }
    }
}