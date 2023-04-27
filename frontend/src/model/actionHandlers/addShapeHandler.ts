import { ActionType } from "../Action";
import { IMessageShape } from "../IMessageShape";
import IShape from "../IShape";
import { shapeInflaters } from "../shapeInflaters";
import { ActionHandler } from "./actionHandlers";

export const addShapeHandler: ActionHandler = async (project, message) => {
    if (message.type !== ActionType.ADD_SHAPE){
        return project;
    };

    const newShape: IShape | null = await shapeInflaters.inflate(message.data.newShape!);
    if (newShape){
        project.getPages().find(p => p.id === message.pageId)
            ?.getLayers().find(l => l.id === message.layerId)
            ?.addElem(newShape);
    }

    project.isLoading = false;
    return project;
}