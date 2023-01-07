import IProjectMeta from "../model/IProjectMeta";

const projectsMetaSymbol: unique symbol = Symbol()

interface IProjectsMetaStore {
    [projectsMetaSymbol]: IProjectMeta[]
    getData: () => IProjectMeta[],
    setData: (projectsMetaData: IProjectMeta[]) => void
}

export const createProjectsMetaStore = () => {
    const store: IProjectsMetaStore = {
        [projectsMetaSymbol]: [],

        getData() {
            return this[projectsMetaSymbol];
        },

        setData(projectsMetaData: IProjectMeta[]){
            this[projectsMetaSymbol] = projectsMetaData
        }
    };

    return store
}

export type TProjectsMetaStore = ReturnType<typeof createProjectsMetaStore>