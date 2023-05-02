import { ActionType } from "../Action";
import { IMessageShape } from "../IMessageShape";
import IShape from "../IShape";
import { shapeInflaters } from "../shapeInflaters";
import { ActionHandler } from "./actionHandlers";

export const changeGraphicalPropertyHandler: ActionHandler = async (project, message) => {
    if (message.type !== ActionType.CHANGE_GRAPHICAL_PROPERTY) {
        return project;
    };

    console.log(message)
    // const newShape: IShape | null = await shapeInflaters.inflate(message.data.newShape!);
    // if (newShape) {
    //     project.getPages().find(p => p.id === message.pageId)
    //         ?.getLayers().find(l => l.id === message.layerId)
    //         ?.addShape(newShape);
    // }

    project.isLoading = false;
    return project;
}