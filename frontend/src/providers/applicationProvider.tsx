import React, { useCallback, useContext, useState } from "react";
import text, { Language, languages } from "../languages/language";
import ILanguage from "../languages/ILanguage";
import ActionsHistory from "../model/ActionsHistory";
import IAction from "../model/Action";

export interface ApplicationData {
    actionsHistory: ActionsHistory
    addAction(action: IAction): void
    undo(): void
};

export const ApplicationContext = React.createContext<ApplicationData | null>(null);

type Props = {
    children?: React.ReactNode
};

export const ApplicationProvider: React.FC<Props> = ({ children }) => {
    const actionsHistory = new ActionsHistory();
    const addAction: (action: IAction) => void = useCallback(action => {
        actionsHistory.push(action);
    }, []);

    const undo: () => void = useCallback(() => {
        let action: IAction | undefined = actionsHistory.pop();
        action?.undo();
    }, []);

    const applicationData: ApplicationData = {
        actionsHistory,
        addAction,
        undo
    }

    return (
        <ApplicationContext.Provider value={applicationData}>
            {children}
        </ApplicationContext.Provider>
    );
}

export const useApplicationContext = () => useContext(ApplicationContext)