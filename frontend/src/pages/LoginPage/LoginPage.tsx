import React, { useState } from "react";
import "../../styles/login.scss";
import bmstuIcon from "../../assets/images/bmstu-icon.svg";
import loginImage from "../../assets/images/login-image.webp";
import LoginPanel from "./LoginPanel";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import text, { Language, languages } from "../../languages/language";

const LoginPage: React.FC = () => {
    const [language, setLanguage] = useState<Language>(() => {
        const defaultLang: Language = "en"; 
        const data = localStorage.getItem("language");
        const lang = languages.filter(l => l === data)[0]
        return lang || defaultLang;
    });

    return (
        <div id="loginPage">
            <Tabs>
                <header>
                    <div className="container">
                        <div className="nav-bar">
                            <div className="logo-block">
                                <div className="logo">
                                    <img src={bmstuIcon} alt="МГТУ им. Н.Э. Баумана" />
                                </div>
                                <p className="tagline">{text[language].loginPage.slog.first}<br />
                                    {text[language].loginPage.slog.second}</p>
                            </div>
                            <div className="nav-block">
                                <TabList>
                                    <Tab>{text[language].loginPage.login}</Tab>
                                    <Tab>{text[language].loginPage.aboutTheProject}</Tab>
                                    <Tab>{text[language].loginPage.rates}</Tab>
                                    <Tab>{text[language].loginPage.contactWithDevelopers}</Tab>
                                </TabList>
                            </div>
                            <div className="lang-block">
                                <button onClick={() => {
                                    localStorage.setItem("language", "ru");
                                    setLanguage("ru");
                                }}>RU</button>
                                <button onClick={() => {
                                    localStorage.setItem("language", "en");
                                    setLanguage("en");
                                }}>EN</button>
                            </div>
                        </div>
                    </div>
                </header>
                <main>
                    <div className="container">
                        <div className="image-block">
                            <img src={loginImage} alt="Netplanner" />
                        </div>
                        <div className="content-block">
                            <TabPanel>
                                <LoginPanel language={language} />
                            </TabPanel>
                            <TabPanel>About the project</TabPanel>
                            <TabPanel>Rates</TabPanel>
                            <TabPanel>Contact with developers</TabPanel>
                        </div>
                    </div>
                </main>
                <footer>

                </footer>
            </Tabs>
        </div>
    );
}

export default LoginPage;
