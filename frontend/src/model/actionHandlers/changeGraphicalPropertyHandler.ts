import { ActionType } from "../actions/ActionType";
import { ActionHandler } from "./actionHandlers";

export const changeGraphicalPropertyHandler: ActionHandler = async (project, message) => {
    if (message.type !== ActionType.CHANGE_GRAPHICAL_PROPERTY) {
        return project;
    };

    console.log(message)

    const searchedShape = project.getCurrentPage()
        ?.getLayers().find(layer => layer.getID() === message.layerId)
        ?.getShapes().find(shape => shape.config.id! === message.shapeId);

    // console.log(searchedShape)
    if (searchedShape)
        searchedShape.config.graphicalProperties =
            Object.assign(Object.fromEntries(Object.entries(searchedShape.config.graphicalProperties).map(
                ([key, obj]) => [key, { ...obj, value: (message.data.graphicalProperties! as any)[key] }]
            )
                // ([key, { value }]) => !!message.data.graphicalProperties[key] ? message.data.graphicalProperties[key].value : message.data.graphicalProperties[key]
            ),
                {
                    x: { ...searchedShape.config.graphicalProperties.x, value: message.data.graphicalProperties!.x },
                    y: { ...searchedShape.config.graphicalProperties.y, value: message.data.graphicalProperties!.y },
                    pivot: { ...searchedShape.config.graphicalProperties.pivot, value: message.data.graphicalProperties!.pivot }
                }
            )
    // searchedShape.config.graphicalProperties = message.data.graphicalProperties!;

    project.setIsLoading(false);
    return project;
}