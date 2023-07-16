import { ActionType } from "../actions/ActionType";
import { AddPageAction } from "../actions/AddPageAction";
import Layer from "../projectData/Layer";
import Page from "../projectData/Page";
// import { IMessageShape } from "../IMessageShape";
// import IShape from "../IShape";
// import { shapeInflaters } from "../shapeInflaters";
import { ActionHandler } from "./actionHandlers";

export const addPageHandler: ActionHandler = async (project, message, actionStory) => {
    if (message.type !== ActionType.ADD_PAGE) {
        return project;
    };
    
    const action = actionStory.find(a => a.uid === message.uid)! as AddPageAction;
    action && action.setPageId(message.data?.newPage!.id!);

    const newPage: Page =
        new Page(message.data!.newPage!.id,
            message.data!.newPage!.name,
            []);

    message.data!.newPage?.layers!
        .map(layer => new Layer(layer.id, layer.zIndex!, layer.name, []))
        .forEach(layer => newPage.addLayer(layer));

    if (newPage) {
        project?.addPage(newPage)
    }

    project.setIsLoading(false);
    return project;
}