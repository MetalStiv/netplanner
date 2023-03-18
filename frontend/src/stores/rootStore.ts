import { createProjectsMetaStore, TProjectsMetaStore } from "./projectsMetaStore";
import { createProjectStore, TProjectStore } from "./projectStore"; 
import { createUsersStore, TUsersStore } from "./usersStore";
import { createUserStore, TUserStore } from "./userStore"; 

const projectStoreSymbol: unique symbol = Symbol()
const userStoreSymbol: unique symbol = Symbol()
const usersStoreSymbol: unique symbol = Symbol()
const projectsMetaStoreSymbol: unique symbol = Symbol()

interface IRootStore {
    [projectStoreSymbol]: TProjectStore,
    [userStoreSymbol]: TUserStore,
    [usersStoreSymbol]: TUsersStore,
    [projectsMetaStoreSymbol]: TProjectsMetaStore,

    getProjectStore: () => TProjectStore,
    getUserStore: () => TUserStore,
    getUsersStore: () => TUsersStore,
    getProjectsMetaStore: () => TProjectsMetaStore,

    clearStore: () => void,
}

export const createRootStore = () => {
    const store: IRootStore = {
        [projectStoreSymbol]: createProjectStore() as TProjectStore,
        [userStoreSymbol]: createUserStore() as TUserStore,
        [usersStoreSymbol]: createUsersStore() as TUsersStore,
        [projectsMetaStoreSymbol]: createProjectsMetaStore() as TProjectsMetaStore,

        getProjectStore() {
            return this[projectStoreSymbol];
        },

        getUserStore() {
            return this[userStoreSymbol];
        },

        getUsersStore() {
            return this[usersStoreSymbol];
        },

        getProjectsMetaStore() {
            return this[projectsMetaStoreSymbol];
        },

        clearStore() {
            this[projectStoreSymbol].clearStore();
            this[userStoreSymbol].clearStore();
            this[usersStoreSymbol].clearStore();
            this[projectsMetaStoreSymbol].clearStore();
        }
    };

    return store
}

export type TRootStore = ReturnType<typeof createRootStore>