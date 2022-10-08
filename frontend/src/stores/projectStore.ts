import IProject from "../model/IProject";

const projectsSymbol: unique symbol = Symbol()

interface IProjectStore {
    [projectsSymbol]: IProject[],
    getProjects: () => IProject[]
}

export const createProjectStore = () => {
    const store: IProjectStore = {
        [projectsSymbol]: [{name: 'project1'}] as IProject[],

        getProjects() {
            return this[projectsSymbol];
        },
    };

    return store
}

export type TProjectStore = ReturnType<typeof createProjectStore>