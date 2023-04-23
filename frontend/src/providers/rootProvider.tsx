import React, { useCallback, useContext, useEffect, useState } from "react";
import { createRootStore, TRootStore } from "../stores/rootStore";
import { useLocalObservable } from 'mobx-react-lite';
import useWebSocket from "react-use-websocket";
import { getAccessToken } from "axios-jwt";
import IAction from "../model/Action";
import actionHandlers from "../model/actionHandlers/actionHandlers";

export const RootStoreContext = React.createContext<TRootStore>(createRootStore());

type Props = {
    children?: React.ReactNode
};

const WEB_SOCKET_URL: string = "ws://localhost:3005/ws?token=";

export const RootProvider: React.FC<Props> = ({ children }) => {
    const store = useLocalObservable(createRootStore);
    const [currentVal, setCurrentVal] = useState<boolean>(false);

    const updateWebSocket = () => setCurrentVal(!currentVal);
    
    const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(WEB_SOCKET_URL+
        getAccessToken()+'&projectId='+store.getProjectStore().getProjectToLoadId());

    useEffect(() => {
        const handleMessage = async (message: MessageEvent<any> | null) => {
            console.log(message)
            message && console.log(await actionHandlers.handle(store.getProjectStore().getProject()!, JSON.parse(message!.data)));
            message && store.getProjectStore().setProject(
                await actionHandlers.handle(store.getProjectStore().getProject()!, JSON.parse(message!.data))
            );
        }

        handleMessage(lastMessage);
    }, [lastMessage])

    store.getActionStore().setMessageSender(sendMessage);
    store.getProjectStore().setWebSocketUpdater(updateWebSocket);

    return (
        <RootStoreContext.Provider value={store}>
            {children}
        </RootStoreContext.Provider>
    );
}

export const useRootStore = () => useContext(RootStoreContext)