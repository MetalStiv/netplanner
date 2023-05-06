import { IProject } from "../model/projectData/Project"

const projectSymbol: unique symbol = Symbol()
const projectToLoadId: unique symbol = Symbol()
const webSocketUpdaterSymbol: unique symbol = Symbol()
const rerenderSymbol: unique symbol = Symbol()

interface IProjectStore {
    [projectSymbol]: IProject | null,
    [projectToLoadId]: string,
    [webSocketUpdaterSymbol]: (() => void) | null,
    [rerenderSymbol]: boolean,
    setProject: (p: IProject) => void,
    getProject: () => IProject | null,
    setProjectToLoadId: (id: string) => void,
    getProjectToLoadId: () => string,
    setWebSocketUpdater: (webSocketUpdater: () => void) => void,
    rerender: () => void,

    clearStore: () => void,
}

export const createProjectStore = () => {
    const store: IProjectStore = {
        [projectSymbol]: null,
        [projectToLoadId]: "",
        [webSocketUpdaterSymbol]: null,
        [rerenderSymbol]: true,

        setProject(p: IProject) {
            this[projectSymbol] = p;
        },

        getProject() {
            return this[projectSymbol];
        },

        setProjectToLoadId(id: string) {
            this[projectToLoadId] = id;
            this[webSocketUpdaterSymbol]!();
        },

        getProjectToLoadId() {
            return this[projectToLoadId];
        },

        setWebSocketUpdater(webSocketUpdater: () => void) {
            this[webSocketUpdaterSymbol] = webSocketUpdater;
        },

        rerender() {
            this[rerenderSymbol] = !this[rerenderSymbol];
        },

        clearStore() {
            this[projectSymbol] = null;
        }
    };

    return store
}

export type TProjectStore = ReturnType<typeof createProjectStore>