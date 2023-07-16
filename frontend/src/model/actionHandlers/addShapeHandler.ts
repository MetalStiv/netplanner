import { shapeInflaters } from "../shapes/shapeInflaters";
import IShape from "../shapes/IShape";
import { ActionHandler } from "./actionHandlers";
import { ActionType } from "../actions/ActionType";
import { AddShapeAction } from "../actions/AddShapeAction";

export const addShapeHandler: ActionHandler = async (project, message, actionStory) => {
    if (message.type !== ActionType.ADD_SHAPE) {
        return project;
    };

    const action = actionStory.find(a => a.uid === message.uid)! as AddShapeAction;
    action && action.setShapeId(message.data!.newShape!.id!);

    const newShape: IShape | null = await shapeInflaters.inflate(message.data!.newShape!);
    if (newShape) {
        project.getCurrentPage()
            ?.getLayers().find(l => l.getID() === message.layerId)
            ?.addShape(newShape);
    }

    project.setIsLoading(false);
    return project;
}