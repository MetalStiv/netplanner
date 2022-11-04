import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useRootStore } from "../providers/rootProvider";
import * as Yup from "yup";
import IUser from "../model/IUser";
import "../styles/login.scss";
import bmstuIcon from "../assets/images/bmstu-icon.svg";
import loginImage from "../assets/images/login-image.webp";
import LoginForms from "../components/LoginForms";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import text, { Language, languages } from "../languages/language";

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
                                <p className="tagline">{text[language].slog.first}<br />
                                    {text[language].slog.second}</p>
                            </div>
                            <div className="nav-block">
                                <TabList>
                                    <Tab>Login</Tab>
                                    <Tab>Use Netplanner</Tab>
                                    <Tab>{text[language].aboutTheProject}</Tab>
                                    <Tab>Rates</Tab>
                                    <Tab>{text[language].contactWithDevelopers}</Tab>
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
                                <LoginForms />
                            </TabPanel>
                            <TabPanel>Use Netplanner</TabPanel>
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
