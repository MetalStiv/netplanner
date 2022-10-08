import IUser from "../model/IUser";

const userSymbol: unique symbol = Symbol()

interface IUserStore {
    [userSymbol]: IUser | null,
    getData: () => IUser | null,
    setData: (userData: IUser) => void
}

export const createUserStore = () => {
    const store: IUserStore = {
        [userSymbol]: null,

        getData() {
            return this[userSymbol];
        },

        setData(userData: IUser){
            this[userSymbol] = userData
        }
    };

    return store
}

export type TUserStore = ReturnType<typeof createUserStore>