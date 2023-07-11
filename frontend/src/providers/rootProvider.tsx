import React, { useCallback, useContext, useEffect, useState } from "react";
import { createRootStore, TRootStore } from "../stores/rootStore";
import { useLocalObservable } from 'mobx-react-lite';
import { makePersistable } from 'mobx-persist-store';
import useWebSocket from "react-use-websocket";
import { getAccessToken } from "axios-jwt";
import actionHandlers from "../model/actionHandlers/actionHandlers";
import Project from "../model/projectData/Project";

export const RootStoreContext = React.createContext<TRootStore>(createRootStore());

type Props = {
    children?: React.ReactNode
};

const WEB_SOCKET_URL: string = "ws://localhost:3005/ws?token=";

export const RootProvider: React.FC<Props> = ({ children }) => {
    const store = useLocalObservable(createRootStore);
    // makePersistable(store, { 
    //     name: 'rootStore', 
    //     properties: [{
    //         key: 'getUserStore',
    //         serialize: v => {
    //             return v.call(this).getData()
    //         },
    //         deserialize: v => {
    //             return v.split(',');
    //         }
    //     }],
    //     storage: window.localStorage
    // });

    const [currentVal, setCurrentVal] = useState<boolean>(false);

    const updateWebSocket = () => setCurrentVal(!currentVal);

    const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(WEB_SOCKET_URL +
        getAccessToken() + '&projectId=' + store.getProjectStore().getProjectToLoadId());

    store.getActionStore().setMessageSender(sendMessage);
    store.getProjectStore().setWebSocketUpdater(updateWebSocket);

    useEffect(() => {
        const handleMessage = async (message: MessageEvent<any> | null) => {
            if (!message) {
                return;
            }
            console.log(message.data);
            const handledProject: Project =
                await actionHandlers.handle(store.getProjectStore().getProject()!, JSON.parse(message!.data), store.getActionStore().getActions());
            console.log("New project");
            console.log(handledProject);
            store.getProjectStore().setProject(handledProject);
            store.getProjectStore().rerender();
        }
        handleMessage(lastMessage);
    }, [lastMessage])

    return (
        <RootStoreContext.Provider value={store}>
            {children}
        </RootStoreContext.Provider>
    );
}

export const useRootStore = () => useContext(RootStoreContext)