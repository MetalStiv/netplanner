import { useCallback, useState } from "react";
import ILanguage from "../../languages/ILanguage";
import text, { Language, languages } from "../../languages/language";

const useLanguage = () => {
    const data = localStorage.getItem("language");
    const lang: Language = languages.filter(l => l === data)[0] || "en";
    const [language, setLanguage] = useState<Language>(lang);

    let langText: ILanguage = text[lang];

    const switchLanguage = useCallback((lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
        langText = text[lang];
    }, [])

    return [language, languages, switchLanguage, langText] as const;
}

export default useLanguage;