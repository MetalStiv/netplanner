import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/user.scss';
import { useRootStore } from "../../providers/rootProvider";
import workImage from '../../assets/images/Work.svg';
import bookImage from '../../assets/images/Book.png';
import settingImage from '../../assets/images/Setting.svg';
import logoutImage from '../../assets/images/Logout.svg';
import icoImage from '../../assets/images/Ellipse.png';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SettingPage from "./Settings";
import { projectMicroservice } from "../../common/axiosMicroservices";
import ProjectPanel from "./ProjectPanel";
import { TProjectsMetaStore } from "../../stores/projectsMetsStore";

const UserPage: React.FC = () => {
    const navigate = useNavigate();
    const projectsMetaStore: TProjectsMetaStore = useRootStore()!.getProjectsMetaStore();

    const getProjects = useCallback(async () => {
        let projects = await projectMicroservice.get('getProjects')
        if (projects.status === 200){
            projectsMetaStore?.setData(projects.data)
        }
    }, [projectsMetaStore])

    const addProject = async () => {
        let projects = await projectMicroservice.post('addProject')
        if (projects.status !== 200){
            alert(projects.statusText)
        }
        getProjects()
    }

    useEffect(() => {
        getProjects()
    }, [getProjects])

    return (
        <div id="userPage">
            <Tabs>
                <div className="main">
                    <div className="leftMenu"></div>
                    <div className="rightMenu">
                        <TabPanel>
                            {
                                projectsMetaStore?.getData().length === 0 ? <div className="startMenu">
                                        <div className="text">Start a new project</div>
                                        <button type="submit" onClick={addProject}>+</button>
                                    </div>
                                    : projectsMetaStore?.getData().map(p => <ProjectPanel projectMeta={p} />)
                            }
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