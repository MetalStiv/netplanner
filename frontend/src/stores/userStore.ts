import IUser from "../model/IUser";
import IInvite from "../model/projectData/IInvite";

const userSymbol: unique symbol = Symbol()
const invitesSymbol: unique symbol = Symbol()

interface IUserStore {
    [userSymbol]: IUser | null,
    [invitesSymbol]: IInvite[],
    getData: () => IUser | null,
    setData: (userData: IUser) => void,

    setInvites: (invites: IInvite[]) => void,
    getInvites: () => IInvite[],

    clearStore: () => void,
}

export const createUserStore = () => {
    const store: IUserStore = {
        [userSymbol]: null,
        [invitesSymbol]: [],

        getData() {
            return this[userSymbol];
        },

        setData(userData: IUser){
            this[userSymbol] = userData
        },

        setInvites(invites: IInvite[]){
            this[invitesSymbol] = invites;
        },

        getInvites(){
            return this[invitesSymbol];
        },

        clearStore(){
            this[userSymbol] = null;
        }
    };

    return store
}

export type TUserStore = ReturnType<typeof createUserStore>