import React, { useCallback, useContext, useEffect, useState } from "react";
import { createRootStore, TRootStore } from "../stores/rootStore";
import { useLocalObservable } from 'mobx-react-lite';
import useWebSocket from "react-use-websocket";
import { getAccessToken } from "axios-jwt";
import IAction from "../model/Action";

export const RootStoreContext = React.createContext<TRootStore>(createRootStore());

type Props = {
    children?: React.ReactNode
};

const WEB_SOCKET_URL: string = "ws://localhost:3005/ws?token=";

export const RootProvider: React.FC<Props> = ({ children }) => {
    const store = useLocalObservable(createRootStore);
    
    const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(WEB_SOCKET_URL+
        getAccessToken()+'&projectId='+store.getProjectStore().getProject()?.id);

    useEffect(() => {
        console.log(lastMessage)
    }, [lastMessage])

    store.getActionStore().setMessageSender(sendMessage);

    return (
        <RootStoreContext.Provider value={store}>
            {children}
        </RootStoreContext.Provider>
    );
}

export const useRootStore = () => useContext(RootStoreContext)