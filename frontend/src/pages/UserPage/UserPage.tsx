import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from 'formik';
import '../../styles/home/index.scss';
import Project from "../../module/projectCard/Project";
import workImage from '../../assets/images/Work.svg';
import bookImage from '../../assets/images/Book.png';
import settingImage from '../../assets/images/Setting.svg';
import logoutImage from '../../assets/images/Logout.svg';
import icoImage from '../../assets/images/Ellipse.png';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SettingPage from "./Settings";

const UserPage: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div id="userPage">
            <Tabs>
                <div className="main">
                    <div className="leftMenu"></div>
                    <div className="rightMenu">
                        <TabPanel>
                            <div className="startMenu">

                                <div className="text">Start a new project</div>
                                <button type="submit">+</button>
                                {/* <Project /> */}

                            </div>
                        </TabPanel>

                        <TabPanel></TabPanel>
                        <TabPanel>

                            <SettingPage />

                        </TabPanel>

                    </div>

                </div>

                <div className="leftContent">

                    <div className="iconUser">
                        <img src={icoImage} alt='Icon' />
                    </div>


                    <div className="frame">
                        <TabList>
                            <Tab>
                                <div className="rectangle">
                                    <img src={workImage} alt='Work' />
                                </div>
                            </Tab>
                            <Tab>
                                <div className="rectangle">
                                    <img src={bookImage} alt='Book' />
                                </div>
                            </Tab>
                            <Tab>
                                <div className="rectangle">
                                    <img src={settingImage} alt='Setting' />
                                </div>
                            </Tab>
                        </TabList>
                    </div>


                    <div onClick={() => navigate('/')} className="logout">
                        <img src={logoutImage} alt='Logout' />
                    </div>
                </div>
            </Tabs>
        </div>


    );
}
export default UserPage;