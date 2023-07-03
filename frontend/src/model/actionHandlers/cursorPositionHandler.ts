import { ActionType } from "../actions/ActionType";
import UserCursor from "../projectData/UserCursor";
import { ActionHandler } from "./actionHandlers";

export const cursorPositionHandler: ActionHandler = async (project, message) => {
    if (message.type !== ActionType.CURSOR_POSITION) {
        return project;
    };

    console.log(message)
    console.log(project)

    // if (message.senderId === ){
    //     project.setIsLoading(false);
    //     return project;
    // }

    if (project?.getCursors().find(c => c.userId === message.senderId)){
        project.moveCursor(message.senderId!, message.data.coords!);
    }
    else {
        project.addCursor(new UserCursor(message.senderId!, message.pageId!, message.data.coords!))
    }

    project.setIsLoading(false);
    return project;
}