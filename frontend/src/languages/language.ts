import ILanguage from "./ILanguage";
import { eng } from "./eng";
import { ru } from "./ru";

export type Language = "en" | "ru";
export const languages: Language[] = ["en", "ru"];

const text: {[key: string]: ILanguage} = {};
text["en"] = eng;
text["ru"] = ru;

export default text;