import IUser from "../model/IUser";

const usersSymbol: unique symbol = Symbol()

interface IUsersStore {
    [usersSymbol]: IUser[],
    getData: () => IUser[],
    setData: (users: IUser[]) => void,

    clearStore: () => void,
}

export const createUsersStore = () => {
    const store: IUsersStore = {
        [usersSymbol]: [],

        getData() {
            return this[usersSymbol];
        },

        setData(users: IUser[]) {
            this[usersSymbol] = users;
        },

        clearStore(){
            this[usersSymbol] = [];
        }
    };

    return store
}

export type TUsersStore = ReturnType<typeof createUsersStore>