import IProjectMeta from "../model/IProjectMeta";

const projectsMetaSymbol: unique symbol = Symbol()
const currentGroupIdSymbol: unique symbol = Symbol()

interface IProjectsMetaStore {
    [projectsMetaSymbol]: IProjectMeta[],
    [currentGroupIdSymbol]: string | null,

    getData: () => IProjectMeta[],
    getById: (id: string | null) => IProjectMeta | undefined,
    setData: (projectsMetaData: IProjectMeta[]) => void,
    updateOrInsert: (newProjectMetaData: IProjectMeta) => void,
    hideById: (id: string) => void,
    switchMenuById: (id: string) => void,

    getCurrentGroupId: () => string | null,
    setCurrentGroupId: (id: string | null) => void,
}

export const createProjectsMetaStore = () => {
    const store: IProjectsMetaStore = {
        [projectsMetaSymbol]: [],
        [currentGroupIdSymbol]: null,

        getData(){
            return this[projectsMetaSymbol];
        },

        getById(id: string | null){
            if (!id) return undefined;
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
        },

        switchMenuById(id: string){
            this[projectsMetaSymbol].forEach(p => p.id === id ? p.showMenu = !p.showMenu : p.showMenu = false)
        },

        getCurrentGroupId(){
            return this[currentGroupIdSymbol];
        },

        setCurrentGroupId(id: string | null){
            this[currentGroupIdSymbol] = id;
        }
    };

    return store
}

export type TProjectsMetaStore = ReturnType<typeof createProjectsMetaStore>