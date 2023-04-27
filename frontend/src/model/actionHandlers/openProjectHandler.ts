import { ActionType } from "../Action";
import IShape from "../IShape";
import Layer from "../Layer";
import Page from "../Page";
import { shapeInflaters } from "../shapeInflaters";
import { ActionHandler } from "./actionHandlers";

export const openProjectHandler: ActionHandler = async (project, message) => {
    if (message.type !== ActionType.OPEN_PROJECT){
        return project;
    };

    const pages: Page[] = await Promise.all(message.data.pages!.map(async p => {
        const newPage = new Page(p.id, p.name, 
            await Promise.all(p.layers.map(async l => new Layer(l.id, 10, l.name, 
                (await Promise.all(l.shapes.map(async s => {
                    const shape: IShape | null = await shapeInflaters.inflate(s);
                    return shape 
                }))).filter((x): x is IShape => x !== null)

            ))));
        newPage.setCurrentLayer(newPage.layers[0].id);
        return newPage;
    }))
    message.data.pages && project.setPages(pages);
    project.setCurrentPage(pages[0].id);
    project.isLoading = false;
    return project;
}