import React, { useContext } from "react";
import { createRootStore, TRootStore } from "../stores/rootStore";
import { useLocalObservable } from 'mobx-react-lite';

export const RootStoreContext = React.createContext<TRootStore>(createRootStore());

type Props = {
    children?: React.ReactNode
};

export const RootProvider: React.FC<Props> = ({ children }) => {
    const store = useLocalObservable(createRootStore);

    return (
        <RootStoreContext.Provider value={store}>
            {children}
        </RootStoreContext.Provider>
    );
}

export const useRootStore = () => useContext(RootStoreContext)