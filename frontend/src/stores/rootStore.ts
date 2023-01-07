import { createProjectsMetaStore, TProjectsMetaStore } from "./projectsMetsStore";
import { createProjectStore, TProjectStore } from "./projectStore"; 
import { createUserStore, TUserStore } from "./userStore"; 

const projectStoreSymbol: unique symbol = Symbol()
const userStoreSymbol: unique symbol = Symbol()
const projectsMetaStoreSymbol: unique symbol = Symbol()

interface IRootStore {
    [projectStoreSymbol]: TProjectStore,
    [userStoreSymbol]: TUserStore,
    [projectsMetaStoreSymbol]: TProjectsMetaStore,
    getProjectStore: () => TProjectStore,
    getUserStore: () => TUserStore,
    getProjectsMetaStore: () => TProjectsMetaStore,
}

export const createRootStore = () => {
    const store: IRootStore = {
        [projectStoreSymbol]: createProjectStore() as TProjectStore,
        [userStoreSymbol]: createUserStore() as TUserStore,
        [projectsMetaStoreSymbol]: createProjectsMetaStore() as TProjectsMetaStore,

        getProjectStore() {
            return this[projectStoreSymbol];
        },

        getUserStore() {
            return this[userStoreSymbol];
        },

        getProjectsMetaStore() {
            return this[projectsMetaStoreSymbol];
        }
    };

    return store
}

export type TRootStore = ReturnType<typeof createRootStore>