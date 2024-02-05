import { createActionStore, TActionStore } from "./actionStore";
import { createProjectsMetaStore, TProjectsMetaStore } from "./projectsMetaStore";
import { createProjectStore, TProjectStore } from "./projectStore"; 
import { createSvgInputStore, TSvgInputStore } from "./svgInputStore";
import { createUsersStore, TUsersStore } from "./usersStore";
import { createUserStore, TUserStore } from "./userStore"; 

const projectStoreSymbol: unique symbol = Symbol()
const userStoreSymbol: unique symbol = Symbol()
const usersStoreSymbol: unique symbol = Symbol()
const projectsMetaStoreSymbol: unique symbol = Symbol()
const actionStoreSymbol: unique symbol = Symbol()
const svgInputStore: unique symbol = Symbol()

interface IRootStore {
    [projectStoreSymbol]: TProjectStore,
    [userStoreSymbol]: TUserStore,
    [usersStoreSymbol]: TUsersStore,
    [projectsMetaStoreSymbol]: TProjectsMetaStore,
    [actionStoreSymbol]: TActionStore,
    [svgInputStore]: TSvgInputStore,

    getProjectStore: () => TProjectStore,
    getUserStore: () => TUserStore,
    getUsersStore: () => TUsersStore,
    getProjectsMetaStore: () => TProjectsMetaStore,
    getActionStore: () => TActionStore,
    getSvgInputStore: () => TSvgInputStore,

    clearStore: () => void,
}

export const createRootStore = () => {
    const store: IRootStore = {
        [projectStoreSymbol]: createProjectStore() as TProjectStore,
        [userStoreSymbol]: createUserStore() as TUserStore,
        [usersStoreSymbol]: createUsersStore() as TUsersStore,
        [projectsMetaStoreSymbol]: createProjectsMetaStore() as TProjectsMetaStore,
        [actionStoreSymbol]: createActionStore() as TActionStore,
        [svgInputStore]: createSvgInputStore() as TSvgInputStore,

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

        getActionStore() {
            return this[actionStoreSymbol];
        },

        getSvgInputStore() {
            return this[svgInputStore];
        },

        clearStore() {
            this[projectStoreSymbol].clearStore();
            this[userStoreSymbol].clearStore();
            this[usersStoreSymbol].clearStore();
            this[projectsMetaStoreSymbol].clearStore();
            this[actionStoreSymbol].clearStore();
            this[svgInputStore].clearStore();
        }
    };

    return store;
}

export type TRootStore = ReturnType<typeof createRootStore>