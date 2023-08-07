import IUser from "../model/IUser";
import IInvite from "../model/projectData/IInvite";
import IShape from "../model/shapes/IShape";

const userSymbol: unique symbol = Symbol()
const invitesSymbol: unique symbol = Symbol()
const copyBufferSymbol: unique symbol = Symbol()

interface IUserStore {
    [userSymbol]: IUser | null,
    [invitesSymbol]: IInvite[],
    [copyBufferSymbol]: IShape[],
    getData: () => IUser | null,
    setData: (userData: IUser) => void,

    putToCopyBuffer: (shapes: IShape[]) => void,
    getFromCopyBuffer: () => IShape[],
    clearCopyBuffer: () => void,

    setInvites: (invites: IInvite[]) => void,
    getInvites: () => IInvite[],

    clearStore: () => void,
}

export const createUserStore = () => {
    const store: IUserStore = {
        [userSymbol]: null,
        [invitesSymbol]: [],
        [copyBufferSymbol]: [],

        getData() {
            return this[userSymbol];
        },

        setData(userData: IUser){
            this[userSymbol] = userData
        },

        putToCopyBuffer(shapes: IShape[]){
            this[copyBufferSymbol] = shapes
        },

        getFromCopyBuffer(){
            return this[copyBufferSymbol]
        },

        clearCopyBuffer(){
            this[copyBufferSymbol] = []
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