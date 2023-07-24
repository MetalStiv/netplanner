import React, { useContext, useEffect, useState } from "react";
import { createRootStore, TRootStore } from "../stores/rootStore";
import { useLocalObservable } from 'mobx-react-lite';
import useWebSocket from "react-use-websocket";
import { getAccessToken } from "axios-jwt";
import actionHandlers from "../model/actionHandlers/actionHandlers";
import Project from "../model/projectData/Project";
import { ActionType } from "../model/actions/ActionType";

export const RootStoreContext = React.createContext<TRootStore>(createRootStore());

type Props = {
    children?: React.ReactNode
};

const WEB_SOCKET_URL: string = "ws://localhost:3005/ws?token=";

export const RootProvider: React.FC<Props> = ({ children }) => {
    const store = useLocalObservable(createRootStore);
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
            if (JSON.parse(message.data).type === ActionType.NO_RIGHTS){
                alert("Not enough rights!")
                return
            }
            const handledProject: Project =
                await actionHandlers.handle(store.getProjectStore().getProject()!, JSON.parse(message!.data), store.getActionStore().getActions());
            console.log("New project");
            console.log(handledProject);
            store.getProjectStore().setProject(handledProject);
            store.getProjectStore().rerender();
        }
        handleMessage(lastMessage);
    }, [lastMessage, store])

    return (
        <RootStoreContext.Provider value={store}>
            {children}
        </RootStoreContext.Provider>
    );
}

export const useRootStore = () => useContext(RootStoreContext)