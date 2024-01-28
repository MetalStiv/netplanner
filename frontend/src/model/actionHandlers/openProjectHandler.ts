import { shapeInflaters } from "../shapes/shapeInflaters";
import IShape from "../shapes/IShape";
import { ActionHandler } from "./actionHandlers";
import { ActionType } from "../actions/ActionType";
import Page from "../projectData/Page";
import Layer from "../projectData/Layer";

export const openProjectHandler: ActionHandler = async (project, message) => {
    if (message.type !== ActionType.OPEN_PROJECT) {
        return project;
    };

    const pages: Page[] = await Promise.all(message.data!.pages!.map(async p => {
        const newPage = new Page(p.id, p.name,
            await Promise.all(p.layers!.map(async l => new Layer(l.id, l.zIndex!, l.name,
                (await Promise.all(l.shapes!.map(async s => {
                    const shape: IShape | null = await shapeInflaters.inflate(s);
                    return shape
                }))).filter((x): x is IShape => x !== null),
                l.isVisible
            ))));
        newPage.setCurrentLayer(newPage.getLayers()[0].getID());
        return newPage;
    }))
    message.data!.pages && project.setPages(pages);
    project.setCurrentPage(pages[0].getID());
    project.setIsLoading(false);
    return project;
}