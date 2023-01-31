import React from "react";
import "../../styles/login/index.scss";
import bmstuIcon from "../../assets/images/bmstu-icon.svg";
import loginImage from "../../assets/images/login-image.webp";
import LoginPanel from "./LoginPanel";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import useLanguage from "../../hooks/useLanguage";

const LoginPage: React.FC = () => {
    const [language, , switchLanguage, langText] = useLanguage();

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
                                <p className="tagline">{langText.loginPage.slog.first}<br />
                                    {langText.loginPage.slog.second}</p>
                            </div>
                            <div className="nav-block">
                                <TabList>
                                    <Tab>{langText.loginPage.login}</Tab>
                                    <Tab>{langText.loginPage.aboutTheProject}</Tab>
                                    <Tab>{langText.loginPage.rates}</Tab>
                                    <Tab>{langText.loginPage.contactWithDevelopers}</Tab>
                                </TabList>
                            </div>
                            <div className="lang-block">
                                <button className={language === "ru" ? "current" : ""} onClick={() => {
                                    switchLanguage("ru")
                                }}>RU</button>
                                <button className={language === "en" ? "current" : ""} onClick={() => {
                                    switchLanguage("en")
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
