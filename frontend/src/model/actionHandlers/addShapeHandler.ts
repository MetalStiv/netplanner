import { shapeInflaters } from "../shapes/shapeInflaters";
import IShape from "../shapes/IShape";
import { ActionHandler } from "./actionHandlers";
import { ActionType } from "../actions/ActionType";

export const addShapeHandler: ActionHandler = async (project, message) => {
    if (message.type !== ActionType.ADD_SHAPE) {
        return project;
    };

    const newShape: IShape | null = await shapeInflaters.inflate(message.data.newShape!);
    if (newShape) {
        project.getCurrentPage() //.getPages()..find(p => p.getID() === message.pageId)
            ?.getLayers().find(l => l.getID() === message.layerId)
            ?.addShape(newShape);
    }

    project.setIsLoading(false);
    return project;
}