import React from "react";
import "../../styles/login/index.scss";
import bmstuIcon from "../../assets/images/bmstu-icon.svg";
import loginImage from "../../assets/images/login-image.webp";
import LoginPanel from "./LoginPanel";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { LanguageData, useLanguageContext } from "../../providers/languageProvider";

const LoginPage: React.FC = () => {
    const lang: LanguageData | null = useLanguageContext();

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
                                <p className="tagline">{lang!.langText.loginPage.slog.first}<br />
                                    {lang!.langText.loginPage.slog.second}</p>
                            </div>
                            <div className="nav-block">
                                <TabList>
                                    <Tab>{lang!.langText.loginPage.login}</Tab>
                                    <Tab>{lang!.langText.loginPage.aboutTheProject}</Tab>
                                    <Tab>{lang!.langText.loginPage.rates}</Tab>
                                    <Tab>{lang!.langText.loginPage.contactWithDevelopers}</Tab>
                                </TabList>
                            </div>
                            <div className="lang-block">
                                <button className={lang!.language === "ru" ? "current" : ""} onClick={() => {
                                    lang!.switchLanguage("ru")
                                }}>RU</button>
                                <button className={lang!.language === "en" ? "current" : ""} onClick={() => {
                                    lang!.switchLanguage("en")
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
                                <LoginPanel />
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
