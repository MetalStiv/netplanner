import IProjectMeta from "../model/projectData/IProjectMeta";

const projectsMetaSymbol: unique symbol = Symbol()
const groupPathSymbol: unique symbol = Symbol()
const searchFilterSymbol: unique symbol = Symbol()

interface IProjectsMetaStore {
    [projectsMetaSymbol]: IProjectMeta[],
    [searchFilterSymbol]: string | undefined,
    [groupPathSymbol]: string[],

    getData: () => IProjectMeta[],
    getById: (id: string | null) => IProjectMeta | undefined,
    setData: (projectsMetaData: IProjectMeta[]) => void,
    updateOrInsert: (newProjectMetaData: IProjectMeta) => void,
    hideById: (id: string) => void,
    switchMenuById: (id: string) => void,

    getCurrentGroupId: () => string | null,
    inGroup: (id: string) => void,
    outGroup: () => void,
    toGroup: (id: string | null) => void,
    getGroups: () => string[],
    getSearchFilter: () => string | undefined,
    setSearchFilter: (filter : string | undefined) => void,

    clearStore: () => void,
}

export const createProjectsMetaStore = () => {
    const store: IProjectsMetaStore = {
        [projectsMetaSymbol]: [],
        [groupPathSymbol]: [],
        [searchFilterSymbol]: undefined,

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
            return this[groupPathSymbol].length > 0 ? this[groupPathSymbol][this[groupPathSymbol].length-1] : null;
        },

        inGroup(id: string){
            this[groupPathSymbol].push(id)
        },

        outGroup(){
            this[groupPathSymbol].pop()
        },

        toGroup(id: string | null){
            while (this[groupPathSymbol].length > 0){
                if (this[groupPathSymbol][this[groupPathSymbol].length-1] === id){
                    break;
                }
                this.outGroup()
            }
        },

        getGroups(){
            return this[groupPathSymbol];
        },

        getSearchFilter(){
            return this[searchFilterSymbol];
        },

        setSearchFilter(filter: string | undefined){
            this[searchFilterSymbol] = filter;
        },

        clearStore(){
            this[projectsMetaSymbol] = [];
            this[groupPathSymbol] = [];
            this[searchFilterSymbol] = undefined;
        }
    };

    return store
}

export type TProjectsMetaStore = ReturnType<typeof createProjectsMetaStore>