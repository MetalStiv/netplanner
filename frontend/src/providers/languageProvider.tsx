import React, { useCallback, useContext, useState } from "react";
import text, { Language, languages } from "../languages/language";
import ILanguage from "../languages/ILanguage";

export interface LanguageData{
    language: Language,
    languages: Language[],
    switchLanguage: (lang: Language) => void,
    langText: ILanguage
};

export const LanguageContext = React.createContext<LanguageData | null>(null);

type Props = {
    children?: React.ReactNode
};

export const LanguageProvider: React.FC<Props> = ({ children }) => {
    const data = localStorage.getItem("lang");
    const lang: Language = languages.filter(l => l === data)[0] || "en";

    const [language, setLanguage] = useState<Language>(lang);
    const [langText, setlangText] = useState<ILanguage>(text[lang]);
    
    const switchLanguage: (lang: Language) => void = useCallback(lang => {
        localStorage.setItem('lang', lang);
        setLanguage(lang);
        setlangText(text[lang])
    }, []);
    
    const languageData: LanguageData = {
        language,
        languages,
        switchLanguage,
        langText
    };

    return (
        <LanguageContext.Provider value={languageData}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguageContext = () => useContext(LanguageContext)