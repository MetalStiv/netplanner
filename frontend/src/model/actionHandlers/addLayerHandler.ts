import { ActionType } from "../actions/ActionType";
import { AddLayerAction } from "../actions/AddLayerAction";
import Layer from "../projectData/Layer";
import IShape from "../shapes/IShape";
import { shapeInflaters } from "../shapes/shapeInflaters";
import { ActionHandler } from "./actionHandlers";

export const addLayerHandler: ActionHandler = async (project, message, actionStory) => {
    if (message.type !== ActionType.ADD_LAYER) {
        return project;
    };

    const action = actionStory.find(a => a.uid === message.uid)! as AddLayerAction;
    action && action.setLayerId(message.data?.newLayer?.id!);
    console.log(action);

    const newLayer: Layer =
        new Layer(message.data!.newLayer!.id,
            message.data!.newLayer!.zIndex!,
            message.data!.newLayer!.name,

            (await Promise.all(message.data!.newLayer!.shapes!.map(async s => {
                const shape: IShape | null = await shapeInflaters.inflate(s);
                return shape
            }))).filter((x): x is IShape => x !== null)
        )

    if (newLayer) {
        project.getPages().find(p => p.getID() === message.pageId)
            ?.addLayer(newLayer)
    }

    project.setIsLoading(false);
    return project;
}