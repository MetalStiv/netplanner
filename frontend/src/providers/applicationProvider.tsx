import React, { useCallback, useContext, useState } from "react";
import text, { Language, languages } from "../languages/language";
import ILanguage from "../languages/ILanguage";
import ActionsHistory from "../model/ActionsHistory";
import IAction from "../model/Action";

export interface ApplicationData {
    // language: Language,
    // languages: Language[],
    // switchLanguage: (lang: Language) => void,
    // langText: ILanguage
    actionsHistory: ActionsHistory
    addAction(action: IAction): void
    undo(): void
};

export const ApplicationContext = React.createContext<ApplicationData | null>(null);

type Props = {
    children?: React.ReactNode
};

export const ApplicationProvider: React.FC<Props> = ({ children }) => {
    // const data = localStorage.getItem("language");
    // const lang: Language = languages.filter(l => l === data)[0] || "en";

    // const [language, setLanguage] = useState<Language>(lang);
    // const [langText, setlangText] = useState<ILanguage>(text[lang]);
    // const [actionsHistory, setActionsHistory] = useState<ActionsHistory>(new ActionsHistory());
    const actionsHistory = new ActionsHistory();
    // const switchLanguage: (lang: Language) => void = useCallback(lang => {
    //     setLanguage(lang);
    //     setlangText(text[lang])
    // }, []);

    // const languageData: LanguageData = {
    //     language,
    //     languages,
    //     switchLanguage,
    //     langText
    // };
    const addAction: (action: IAction) => void = useCallback(action => {
        actionsHistory.push(action);
        console.log(actionsHistory)
    }, []);

    const undo: () => void = useCallback(() => {
        let action: IAction | undefined = actionsHistory.pop();
        action?.undo();
        console.log(actionsHistory)
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