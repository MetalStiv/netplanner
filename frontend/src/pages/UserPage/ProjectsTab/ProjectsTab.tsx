import React, { useEffect, useCallback, useState } from "react";
import { useRootStore } from "../../../providers/rootProvider";
import { TProjectsMetaStore } from "../../../stores/projectsMetaStore";
import { projectMicroservice, userMicroservice } from "../../../common/axiosMicroservices";
import ProjectCard from "./ProjectCard";
import IProjectMeta from "../../../model/IProjectMeta";
import { observer } from "mobx-react-lite";
import { TUsersStore } from "../../../stores/usersStore";
import IUser from "../../../model/IUser";
import ProjectGroupCard from "./ProjectGroupCard";
import { LanguageData, useLanguageContext } from "../../../providers/languageProvider";

const ProjectsTab: React.FC = observer(() => {
    const projectsMetaStore: TProjectsMetaStore = useRootStore()!.getProjectsMetaStore();
    const usersStore: TUsersStore = useRootStore()!.getUsersStore();
    const lang: LanguageData | null = useLanguageContext();

    const getUsers = useCallback(async (projects: IProjectMeta[]) => {
        const userIds: Set<string> = new Set<string>();
        projects.forEach((project: IProjectMeta) => {
            userIds.add(project.ownerId);
            if (project.subscriberIds){
                project.subscriberIds.forEach(id => userIds.add(id))
            }
        });
        const users = await userMicroservice.get<IUser[]>('getUsersByIds', { params: {ids: Array.from(userIds)}})
        if (users.status === 200){
            usersStore?.setData(users.data)
        }
    }, [usersStore])

    const getProjects = useCallback(async () => {
        let projects = await projectMicroservice.get<IProjectMeta[]>('getProjects')
        if (projects.status === 200){
            const data = projects.data.map((item: IProjectMeta) => ({...item, "hide": false, "showMenu": false}));
            await getUsers(data)
            projectsMetaStore?.setData(data)
        }
    }, [projectsMetaStore, getUsers])

    const addProject = async () => {
        let addProject = await projectMicroservice.post('addProject', {
            "name": lang!.langText.userPage.projectTab.defaultName,
            "defaultPageName": lang!.langText.userPage.projectTab.defaultPageName,
            "defaultLayerName": lang!.langText.userPage.projectTab.defaultLayerName,
            "groupId": projectsMetaStore.getCurrentGroupId(),
            "isGroup": false
        })
        if (addProject.status !== 200){
            alert(addProject.statusText)
        }
        projectsMetaStore.updateOrInsert(addProject.data)
    }

    const addProjectGroup = async () => {
        let addProject = await projectMicroservice.post('addProject', {
            "name": lang!.langText.userPage.projectTab.defaultGroupName,
            "groupId": projectsMetaStore.getCurrentGroupId(),
            "isGroup": true
        })
        if (addProject.status !== 200){
            alert(addProject.statusText)
        }
        projectsMetaStore.updateOrInsert(addProject.data)
    }

    useEffect(() => {
        getProjects()
    }, [getProjects])

    return (
        <div id="projects-tab">
            <div id="navigation">
                <div className="group-navigation-button-group">
                    <button className="navigation-button" onClick={() => projectsMetaStore.outGroup()}>
                        <svg width="12" height="19" viewBox="0 0 12 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 16.8544V2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M10 7.85437L6 2" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6 1.99988L2 7.85425" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <button className="navigation-button" onClick={() => projectsMetaStore.toGroup(null)}>
                        <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.37238 16.3739L7.62769 2.48022" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
                <div className="groups-container">
                {
                    (projectsMetaStore.getSearchFilter() === '' || projectsMetaStore.getSearchFilter() === undefined) &&
                        projectsMetaStore.getGroups()
                            .map(g => <div className="group-name" onClick={() => projectsMetaStore.toGroup(g)}>
                                {projectsMetaStore.getById(g)?.name + ' / '}
                            </div>)
                }
                </div>
            </div>
        {
        <>
            {
                (projectsMetaStore?.getSearchFilter() !== undefined && projectsMetaStore?.getSearchFilter() !== '') 
                ? <div className="start-menu">
                        <div className="text text-transformed">{lang!.langText.userPage.projectTab.searchResult + ':'}</div>
                    </div>
                : <div className="start-menu">
                    <div className={projectsMetaStore?.getData()
                        .filter(p => p.groupId === projectsMetaStore.getCurrentGroupId()).length === 0 ? "text" 
                            : "text text-transformed"}>{lang!.langText.userPage.projectTab.startNewProject}</div>
                    <div className={projectsMetaStore?.getData()
                        .filter(p => p.groupId === projectsMetaStore.getCurrentGroupId()).length === 0 ? "add-btn-group"
                            : "add-btn-group add-btn-group-transformed"}>
                        <button id="add-btn-project" type="submit" className="" onClick={addProject}>
                            <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.65405 9.74756H18.3458" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M10 17.1747V2.32031" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                        <button id="add-btn-group" type="submit" className="" onClick={addProjectGroup}>
                            <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d={"M3.06182 8.06909H2.62546C2.56873 8.06909 2.512 8.06909 2.45527 8.06909H2.40073L2.28946 "+
                                    " 8.08655L2.22836 8.104L2.13018 8.13018L2.06691 8.152L1.97746 8.18691L1.91636 8.21746L1.83127 "+
                                    " 8.25891L1.77673 8.31782L1.70036 8.368C1.68443 8.37952 1.66913 8.39191 1.65455 8.40509L1.58255 "+
                                    " 8.46182C1.56477 8.47669 1.54801 8.49272 1.53236 8.50982C1.50898 8.52923 1.4871 8.55038 1.46691 "+
                                    " 8.57309L1.43636 8.59055V2.42691C1.43636 2.16342 1.54089 1.91069 1.727 1.72417C1.91311 1.53765 "+
                                    " 2.1656 1.43258 2.42909 1.432H7.40146C7.54978 1.43191 7.69622 1.4652 7.82992 1.52941C7.96362 "+
                                    " 1.59362 8.08116 1.68709 8.17382 1.80291L9.22109 3.09673C9.37344 3.28634 9.56646 3.4393 9.78587 "+
                                    " 3.54429C10.0053 3.64927 10.2455 3.70361 10.4887 3.70327H20.7433C20.9012 3.70241 21.0577 3.73284 "+
                                    " 21.2038 3.79281C21.35 3.85278 21.4827 3.94111 21.5945 4.05268C21.7063 4.16426 21.7948 4.29687 "+
                                    " 21.8551 4.44287C21.9153 4.58886 21.946 4.74534 21.9455 4.90327V6.79055L21.9258 6.77091C21.9056 "+
                                    " 6.7482 21.8837 6.72705 21.8604 6.70764L21.8102 6.65964L21.7382 6.60291L21.6815 6.56146L21.6051 "+
                                    " 6.51127L21.5462 6.47637L21.4633 6.43273L21.4 6.40437L21.3105 6.36946L21.2473 6.35418L21.1513 "+
                                    " 6.328L21.088 6.31273C21.0513 6.30479 21.0141 6.29896 20.9767 6.29527H20.9222C20.8655 6.29201 "+
                                    " 20.8087 6.29201 20.752 6.29527H20.3156L16.2727 6.27782C16.1262 6.27859 15.9801 6.2932 15.8364 "+
                                    " 6.32146H15.8211C15.7531 6.33454 15.6861 6.35203 15.6204 6.37382L15.5658 6.39346C15.5135 6.41091 "+
                                    " 15.4633 6.42836 15.4109 6.45018L15.3738 6.46764C15.3193 6.49164 15.2647 6.51782 15.2124 "+
                                    " 6.54618C15.16 6.57455 15.1753 6.568 15.1556 6.57891C15.136 6.58982 15.0662 6.63127 15.0225 "+
                                    " 6.66182L14.9462 6.71855L14.8436 6.79491L14.7629 6.86909C14.7367 6.89527 14.7062 6.91927 14.68 "+
                                    " 6.94764L14.1782 7.46255C13.9906 7.65233 13.7675 7.80321 13.5215 7.90655C13.2755 8.00989 13.0115 "+
                                    " 8.06364 12.7447 8.06473H3.06182M2.92436 20.872H20.4531C20.7061 20.8723 20.9567 20.8227 21.1905 "+
                                    " 20.7262C21.4244 20.6296 21.6369 20.488 21.816 20.3093C21.9951 20.1306 22.1373 19.9184 22.2343 "+
                                    " 19.6847C22.3314 19.4511 22.3815 19.2006 22.3818 18.9476V12.6945C22.3841 12.6786 22.3841 12.6625 "+
                                    " 22.3818 12.6465V4.90327C22.3812 4.471 22.2094 4.05655 21.904 3.75068C21.5985 3.44481 21.1843 "+
                                    " 3.27243 20.752 3.27127H10.4975C10.3199 3.27183 10.1444 3.23298 9.9837 3.15752C9.82297 3.08207 "+
                                    " 9.68099 2.97188 9.568 2.83491L8.51418 1.53237C8.38045 1.36592 8.21102 1.23166 8.01842 "+
                                    " 1.13952C7.82582 1.04737 7.61497 0.99969 7.40146 1H2.42909C2.05063 1.00058 1.6878 1.15103 "+
                                    " 1.41998 1.41844C1.15216 1.68585 1.00115 2.04845 1 2.42691V18.9433C0.999715 19.1963 1.04926 "+
                                    " 19.4468 1.14582 19.6807C1.24237 19.9145 1.38404 20.1271 1.56273 20.3062C1.74142 20.4853 "+
                                    " 1.95364 20.6274 2.18727 20.7245C2.4209 20.8216 2.67137 20.8717 2.92436 20.872ZM1.43636 "+
                                    " 9.70109C1.43636 9.38437 1.56203 9.08058 1.78579 8.85642C2.00954 8.63226 2.3131 8.50603 "+
                                    " 2.62982 8.50546H12.7404C13.2287 8.50402 13.7057 8.35745 14.1105 8.08437C14.2458 7.9932 "+
                                    " 14.3715 7.88867 14.4858 7.77237L14.9876 7.25746C15.0007 7.24218 15.016 7.23127 15.0291 "+
                                    " 7.21818C15.0422 7.20509 15.088 7.15927 15.1207 7.13309C15.3958 6.90582 15.7322 6.76534 "+
                                    " 16.0873 6.72946C16.1469 6.72619 16.2066 6.72619 16.2662 6.72946H20.752C21.0659 6.72943 "+
                                    " 21.3672 6.85307 21.5905 7.07359C21.8139 7.29412 21.9414 7.59377 21.9455 7.90764V12.6007C21.9444 "+
                                    " 12.616 21.9444 12.6313 21.9455 12.6465V18.9476C21.9449 19.3421 21.7879 19.7202 21.509 19.9992C21.2301 "+
                                    " 20.2781 20.8519 20.4351 20.4575 20.4356H2.92436C2.5299 20.4351 2.15176 20.2781 1.87283 19.9992C1.5939 "+
                                    " 19.7202 1.43694 19.3421 1.43636 18.9476V9.70109Z"} stroke-width="2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            }
            <div id="project-card-container">
            {
                (projectsMetaStore?.getSearchFilter() !== undefined && projectsMetaStore?.getSearchFilter() !== '')
                    ? projectsMetaStore?.getData()
                        .filter(p => p.name.includes(projectsMetaStore?.getSearchFilter()!))
                        .map(p => { 
                            return p.isGroup ? 
                                <ProjectGroupCard 
                                    projectId={p.id} 
                                    key={`card_${p.id}`} 
                                />
                                : <ProjectCard 
                                        projectId={p.id} 
                                        key={`card_${p.id}`} 
                                />
                        })
                    : projectsMetaStore?.getData()
                        .filter(p => p.groupId === projectsMetaStore.getCurrentGroupId())
                        .map(p => { 
                            return p.isGroup ? 
                                <ProjectGroupCard 
                                    projectId={p.id} 
                                    key={`card_${p.id}`} 
                                />
                                : <ProjectCard 
                                        projectId={p.id} 
                                        key={`card_${p.id}`} 
                                />
                        })
            }
            </div>
        </>
        }
        </div>

    );
})

export default ProjectsTab;