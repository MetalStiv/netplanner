import { createProjectStore, TProjectStore } from "./projectStore"; 
import { createUserStore, TUserStore } from "./userStore"; 

const projectStoreSymbol: unique symbol = Symbol()
const userStoreSymbol: unique symbol = Symbol()

interface IRootStore {
    [projectStoreSymbol]: TProjectStore,
    [userStoreSymbol]: TUserStore,
    getProjectStore: () => TProjectStore,
    getUserStore: () => TUserStore,
}

export const createRootStore = () => {
    const store: IRootStore = {
        [projectStoreSymbol]: createProjectStore() as TProjectStore,
        [userStoreSymbol]: createUserStore() as TUserStore,

        getProjectStore() {
            return this[projectStoreSymbol];
        },

        getUserStore() {
            return this[userStoreSymbol];
        }
    };

    return store
}

export type TRootStore = ReturnType<typeof createRootStore>