import React from "react";
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

const LoginPage: React.FC = () => {
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
                                <p className="tagline">FROM ENGINEERS<br />TO ENGINEERS</p>
                            </div>
                            <div className="nav-block">
                                <TabList>
                                    <Tab>Login</Tab>
                                    <Tab>Use Netplanner</Tab>
                                    <Tab>About the project</Tab>
                                    <Tab>Rates</Tab>
                                    <Tab>Contact with developers</Tab>
                                </TabList>
                            </div>
                            <div className="lang-block">
                                <button>RU</button>
                                <button>EN</button>
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
                            <TabPanel><LoginForms /></TabPanel>
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
