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
// const WEB_SOCKET_URL: string = "ws://d829aea8686a.vps.myjino.ru:49300/ws?token=";

export const RootProvider: React.FC<Props> = ({ children }) => {
    const store = useLocalObservable(createRootStore);
    const [currentVal, setCurrentVal] = useState<boolean>(false);

    const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(WEB_SOCKET_URL +
        getAccessToken() + '&projectId=' + store.getProjectStore().getProjectToLoadId());

    const updateWebSocket = () => {
        // const id = store.getProjectStore().getProjectToLoadId();
        // store.getProjectStore().setProjectToLoadId('_');
        // setCurrentVal(currentVal => !currentVal);
        // store.getProjectStore().setProjectToLoadId(id);
        setCurrentVal(!currentVal);
    }

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