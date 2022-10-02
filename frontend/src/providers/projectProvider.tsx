import React, { useContext } from "react";
import { createProjectStore, TProgectStore } from "../stores/projectStore";
import { useLocalObservable } from 'mobx-react';

export const ProjectContext = React.createContext<TProgectStore | null>(null);

type Props = {
    children?: React.ReactNode
};

export const ProjectProvider: React.FC<Props> = ({ children }) => {
    const store = useLocalObservable(createProjectStore);

    return (
        <ProjectContext.Provider value={store}>
            {children}
        </ProjectContext.Provider>
    );
}

export const useProjectStore = () => useContext(ProjectContext)