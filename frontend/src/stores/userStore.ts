import IUser from "../model/IUser";

const userSymbol: unique symbol = Symbol()

interface IUserStore {
    [userSymbol]: IUser | null,
    getData: () => IUser | null,
    setData: (userData: IUser) => void,

    clearStore: () => void,
}

export const createUserStore = () => {
    const store: IUserStore = {
        [userSymbol]: null,

        getData() {
            return this[userSymbol];
        },

        setData(userData: IUser){
            this[userSymbol] = userData
        },

        clearStore(){
            this[userSymbol] = null;
        }
    };

    return store
}

export type TUserStore = ReturnType<typeof createUserStore>