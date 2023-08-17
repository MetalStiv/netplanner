import IUser from "../model/IUser";
import IInvite from "../model/projectData/IInvite";

const userSymbol: unique symbol = Symbol()
const invitesSymbol: unique symbol = Symbol()
const updatesSymbol: unique symbol = Symbol()

interface IUserStore {
    [userSymbol]: IUser | null,
    [invitesSymbol]: IInvite[],
    [updatesSymbol]: string[],
    getData: () => IUser | null,
    setData: (userData: IUser) => void,

    setInvites: (invites: IInvite[]) => void,
    getInvites: () => IInvite[],

    setUpdates: (updates: string[]) => void,
    getUpdates: () => string[],

    clearStore: () => void,
}

export const createUserStore = () => {
    const store: IUserStore = {
        [userSymbol]: null,
        [invitesSymbol]: [],
        [updatesSymbol]: [],

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

        setUpdates(updates: string[]){
            this[updatesSymbol] = updates;
        },

        getUpdates(){
            return this[updatesSymbol];
        },

        clearStore(){
            this[userSymbol] = null;
            this[invitesSymbol] = [];
            this[updatesSymbol] = [];
        }
    };

    return store
}

export type TUserStore = ReturnType<typeof createUserStore>