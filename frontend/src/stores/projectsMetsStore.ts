import IProjectMeta from "../model/IProjectMeta";

const projectsMetaSymbol: unique symbol = Symbol()

interface IProjectsMetaStore {
    [projectsMetaSymbol]: IProjectMeta[]
    getData: () => IProjectMeta[],
    getById: (id: string) => IProjectMeta | undefined,
    setData: (projectsMetaData: IProjectMeta[]) => void,
    updateOrInsert: (newProjectMetaData: IProjectMeta) => void,
    hideById: (id: string) => void,
}

export const createProjectsMetaStore = () => {
    const store: IProjectsMetaStore = {
        [projectsMetaSymbol]: [],

        getData(){
            return this[projectsMetaSymbol];
        },

        getById(id: string){
            return this[projectsMetaSymbol].find(p => p.id === id)
        },

        setData(projectsMetaData: IProjectMeta[]){
            this[projectsMetaSymbol] = projectsMetaData
        },

        updateOrInsert(projectsMetaData: IProjectMeta){
            const index: number = this[projectsMetaSymbol].findIndex(p => p.id === projectsMetaData.id);
            index === -1 ? 
                this[projectsMetaSymbol] = [...this[projectsMetaSymbol], projectsMetaData]
                : this[projectsMetaSymbol] = [...this[projectsMetaSymbol].slice(0, index), 
                    projectsMetaData, ...this[projectsMetaSymbol].slice(index+1),]
        },

        hideById(id: string){
            const index: number = this[projectsMetaSymbol].findIndex(p => p.id === id);
            const hiddenProjectMeta: IProjectMeta = {
                ...this[projectsMetaSymbol][index], 
                "hide": true
            };
            this[projectsMetaSymbol] = [
                ...this[projectsMetaSymbol].slice(0, index),
                hiddenProjectMeta,
                ...this[projectsMetaSymbol].slice(index+1),
            ]
        }
    };

    return store
}

export type TProjectsMetaStore = ReturnType<typeof createProjectsMetaStore>