import React, { useCallback, useEffect, useRef, useState } from "react";
import bookImage from '../../assets/images/Book.png';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SettingsTab from "./SettingsTab";
import ProjectsTab from "./ProjectsTab/ProjectsTab";
import useLogout from "../../common/customHooks/useLogout";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../providers/rootProvider";
import { TUserStore } from "../../stores/userStore";
import { TUsersStore } from "../../stores/usersStore";
import { TProjectsMetaStore } from "../../stores/projectsMetaStore";
import { LanguageData, useLanguageContext } from "../../providers/languageProvider";
import { projectMicroservice, userMicroservice } from "../../common/axiosMicroservices";
import IProjectMeta from "../../model/projectData/IProjectMeta";
import IInvite from "../../model/projectData/IInvite";
import IUser from "../../model/IUser";
import { updateInfoTime } from "../../common/constants";

const UserPage: React.FC = observer(() => {
    const lang: LanguageData | null = useLanguageContext();
    const logout = useLogout();
    const usersStore: TUsersStore = useRootStore()!.getUsersStore();
    const userStore: TUserStore = useRootStore()!.getUserStore();
    const projectsMetaStore: TProjectsMetaStore = useRootStore()!.getProjectsMetaStore();

    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showNotifications, setShowNotifications] = useState<boolean>(false);
    const projectsTabRef = useRef<HTMLDivElement>(null);
    const settingsTabRef = useRef<HTMLDivElement>(null);
    const nameRef = useRef<HTMLDivElement>(null);

    const getUsers = useCallback(async (projects: IProjectMeta[]) => {
        const userIds: Set<string> = new Set<string>();
        projects.forEach((project: IProjectMeta) => {
            userIds.add(project.ownerId);
            if (project.invites) {
                project.invites.forEach(i => userIds.add(i.userId))
            }
        });
        const users = await userMicroservice.get<IUser[]>('getUsersByIds', { params: { ids: Array.from(userIds) } })
        if (users.status === 200) {
            usersStore?.setData(users.data)
        }
    }, [usersStore])

    const getActiveInvites = useCallback(async () => {
        const invites = await projectMicroservice.get<IInvite[]>('getActiveInvites')
        if (invites.status === 200) {
            userStore?.setInvites(invites.data)
        }
    }, [])

    const getProjects = useCallback(async () => {
        let projects = await projectMicroservice.get<IProjectMeta[]>('getProjects')
        const openMenuId = projectsMetaStore.getData().find(p => p.showMenu === true)?.id ?? "";
        const openShareFormId = projectsMetaStore.getData().find(p => p.showSharingForm === true)?.id ?? "";
        const openMoveFormId = projectsMetaStore.getData().find(p => p.showMoveForm === true)?.id ?? "";

        if (projects.status === 200) {
            const data = projects.data.map((item: IProjectMeta) => ({
                ...item, "hide": false,
                "showMenu": item.id === openMenuId, "showMoveForm": item.id === openMoveFormId,
                "showSharingForm": item.id === openShareFormId
            }));
            await getUsers(data);
            await getActiveInvites();
            projectsMetaStore?.setData(data);
        }

        setIsLoading(false);
    }, [projectsMetaStore, getUsers, getActiveInvites])

    const acceptInvite = async (id: string) => {
        const res = await projectMicroservice.post("/acceptInvite", {
            id: id
        })
        if (res.status === 200) {
            getProjects()
        }
    };

    const declineInvite = async (id: string) => {
        const res = await projectMicroservice.post("/declineInvite", {
            id: id
        })
        if (res.status === 200) {
            getProjects()
        }
    };

    const getUserInfo = useCallback(async () => {
        const res = await userMicroservice.get<IUser>("/whois")
        if (res.status === 200) {
            userStore.setData(res.data)
        }
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            getUserInfo();
            getProjects();
        }, updateInfoTime)
        return () => clearInterval(interval)
    }, [getProjects])

    return (
        <div id="userPage">
            <div className="menu-bar">
                <div className="search-group">
                    <input className="search-input"
                        placeholder={lang!.langText.headerMenu.searchProject}
                        value={projectsMetaStore.getSearchFilter()}
                        onChange={e => projectsMetaStore.setSearchFilter(e.currentTarget.value)}
                        onKeyDown={e => {
                            if (e.keyCode === 27) {
                                projectsMetaStore.setSearchFilter("")
                            }
                        }}
                    />
                </div>
                <div className="user-group">
                    <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg"
                        onClick={() => setShowMenu(!showMenu)} style={{ cursor: 'pointer' }}>
                        <path d="M1 1L5.5 5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="user-avatar">
                        <img src={
                            userStore.getData()?.avatarBase64
                        } onClick={() => setShowMenu(!showMenu)} style={{ cursor: 'pointer' }} />
                    </div>
                    <div className="user-name" ref={nameRef}>
                        {
                            userStore.getData()?.name
                        }
                    </div>
                    {
                        userStore.getInvites().length === 0 ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                            onClick={() => setShowNotifications(!showNotifications)} style={{ cursor: "pointer" }}>
                            <path d="M14.8572 19.4285C14.0953 20.5714 13.1429 21.1428 12.0001 21.1428C10.8572 21.1428 9.90482 20.5714 9.14291 19.4285M17.8109 17.7143H6.18917C5.14727 17.7143 4.30264 16.8696 4.30264 15.8277C4.30264 15.4858 4.39557 15.1503 4.57148 14.8571C5.69322 12.9875 6.28577 10.8483 6.28577 8.66799V7.42854C6.28577 4.90381 8.33247 2.85711 10.8572 2.85711H13.1429C15.6676 2.85711 17.7143 4.90381 17.7143 7.42854V8.66799C17.7143 10.8483 18.3069 12.9875 19.4286 14.8571C19.9647 15.7505 19.675 16.9094 18.7816 17.4454C18.4884 17.6213 18.1529 17.7143 17.8109 17.7143V17.7143Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                            : <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg"
                                onClick={() => setShowNotifications(!showNotifications)} style={{ cursor: "pointer" }}>
                                <path d="M14.8572 21.4285C14.0953 22.5714 13.1429 23.1428 12.0001 23.1428C10.8572 23.1428 9.90482 22.5714 9.14291 21.4285M17.8109 19.7143H6.18917C5.14727 19.7143 4.30264 18.8696 4.30264 17.8277C4.30264 17.4858 4.39557 17.1503 4.57148 16.8571C5.69322 14.9875 6.28577 12.8483 6.28577 10.668V9.42854C6.28577 6.90381 8.33247 4.85711 10.8572 4.85711H13.1429C15.6676 4.85711 17.7143 6.90381 17.7143 9.42854V10.668C17.7143 12.8483 18.3069 14.9875 19.4286 16.8571C19.9647 17.7505 19.675 18.9094 18.7816 19.4454C18.4884 19.6213 18.1529 19.7143 17.8109 19.7143V19.7143Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="17" cy="5" r="4" fill="#599BFF" stroke="#434345" strokeWidth="2" />
                            </svg>
                    }
                </div>

                {
                    showNotifications && <div className="notification-menu-container">
                        <div className="notification-menu-tail" style={{ right: (nameRef.current?.clientWidth! + 140) }}>
                        </div>

                        <div className="notification-menu" style={{ right: (nameRef.current?.clientWidth! + 100) }}>
                            <div className="panel-notification">
                                {
                                    userStore.getInvites().length === 0 ?
                                        lang!.langText.headerMenu.noMessages
                                        : userStore.getInvites().map((i, index) => <div className="notification">
                                            {
                                                index > 0 && <hr className="separator" />
                                            }
                                            <span className="inviter-name">{i.inviterName}</span>
                                            <span>{i.isGroup ? lang!.langText.headerMenu.inviteTextGroup
                                                : lang!.langText.headerMenu.inviteTextProject}</span>
                                            <span className="project-name">'{i.projectName}'</span>
                                            <div className="button-group">
                                                <button className="accept-button" onClick={() => acceptInvite(i.id)}>{lang!.langText.headerMenu.accept}</button>
                                                <button className="decline-button" onClick={() => declineInvite(i.id)}>{lang!.langText.headerMenu.decline}</button>
                                            </div>
                                        </div>)
                                }
                            </div>
                        </div>
                    </div>
                }

                {
                    showMenu &&
                    <div className="main-menu">
                        <div className="panel-menu">
                            <div className="menu-text" onClick={() => projectsTabRef.current?.click()}>
                                {lang!.langText.headerMenu.projects}
                            </div>
                            <hr className="separator" />
                            <div className="menu-text" onClick={() => settingsTabRef.current?.click()}>
                                {lang!.langText.headerMenu.settings}
                            </div>
                            <hr className="separator" />
                            <div className="menu-text" onClick={() => logout()}>
                                {lang!.langText.headerMenu.exit}
                            </div>
                        </div>
                    </div>
                }
            </div>
            <Tabs>
                <div className="main-row">
                    <div className="tab-menu">
                        <TabList>
                            <div className="logo">
                                <svg width="43" height="48" viewBox="0 0 43 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d={"M0 1.48438C0 0.883284 0.485025 0.395996 1.08333 0.395996H11.9167C12.515 0.395996 " +
                                        " 13 0.883282 13 1.48438V46.4709C13 47.072 12.515 47.5593 11.9167 47.5593H1.08333C0.485025 " +
                                        " 47.5593 0 47.072 0 46.4709V1.48438Z"} fill="#176DEA" />
                                    <path d={"M29 1.48438C29 0.883284 29.5223 0.395996 30.1667 0.395996H41.8333C42.4777 0.395996 " +
                                        " 43 0.883282 43 1.48438V46.4709C43 47.072 42.4777 47.5593 41.8333 47.5593H30.1667C29.5223 " +
                                        "47.5593 29 47.072 29 46.4709V1.48438Z"} fill="#176DEA" />
                                    <path d={"M2.0062 8.18811C1.66569 7.70048 1.7932 7.03317 2.29101 6.69764L11.3265 0.607506C11.8243 " +
                                        "0.271974 12.5039 0.395271 12.8444 0.882899L40.0287 39.8118C40.3692 40.2995 40.2417 40.9668 " +
                                        " 39.7439 41.3023L30.7084 47.3924C30.2106 47.728 29.531 47.6047 29.1905 47.117L2.0062 8.18811Z"}
                                        fill="#176DEA" />
                                </svg>
                            </div>

                            <Tab>
                                <div className="rectangle first-rectangle">
                                    <div ref={projectsTabRef} className="menu-icon">
                                        <svg width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.9934 20.2359V16.8533" stroke="#949494" strokeWidth="2"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                            <path fillRule="evenodd" clipRule="evenodd" d={"M22.2532 5.10693C24.5065 5.10693 26.3198 " +
                                                " 6.9336 26.3198 9.18693V13.7736C23.0398 15.6936 18.7065 16.8536 13.9865 16.8536C9.2665 " +
                                                " 16.8536 4.9465 15.6936 1.6665 13.7736V9.1736C1.6665 6.92027 3.49317 5.10693 5.7465 " +
                                                "5.10693H22.2532Z"} strokeWidth="2" strokeLinecap="round"
                                                strokeLinejoin="round" />
                                            <path d={"M18.6601 5.10117V4.61317C18.6601 2.9865 17.3401 1.6665 15.7134 " +
                                                " 1.6665H12.2734C10.6468 1.6665 9.32678 2.9865 9.32678 4.61317V5.10117"}
                                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d={"M1.69922 18.644L1.95122 21.9894C2.12189 24.244 4.00055 25.9867 6.26055 " +
                                                " 25.9867H21.7259C23.9859 25.9867 25.8646 24.244 26.0352 21.9894L26.2872 18.644"}
                                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>

                                    </div>
                                </div>
                            </Tab>
                            <Tab>
                                <div className="rectangle">
                                    <div className="menu-icon">
                                        <img src={bookImage} alt='Book' />
                                    </div>
                                </div>
                            </Tab>
                            <Tab>
                                <div ref={settingsTabRef} className="rectangle">
                                    <div className="menu-icon">
                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d={"M16.0007 19.9998C18.2098 19.9998 20.0007 18.209 20.0007 15.9998C20.0007 13.7907 " +
                                                " 18.2098 11.9998 16.0007 11.9998C13.7916 11.9998 12.0007 13.7907 12.0007 " +
                                                " 15.9998C12.0007 18.209 13.7916 19.9998 16.0007 19.9998Z"} stroke="white"
                                                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d={"M12.3861 25.828L13.1654 27.5806C13.3971 28.1023 13.7751 28.5456 14.2537 " +
                                                " 28.8566C14.7323 29.1677 15.2909 29.3333 15.8617 29.3332C16.4325 29.3333 16.9911 " +
                                                " 29.1677 17.4697 28.8566C17.9483 28.5456 18.3263 28.1023 18.558 27.5806L19.3372 " +
                                                " 25.828C19.6146 25.2061 20.0813 24.6877 20.6706 24.3465C21.2636 24.0044 21.9497 " +
                                                " 23.8587 22.6306 23.9302L24.5373 24.1332C25.1048 24.1932 25.6776 24.0873 26.1862 " +
                                                " 23.8283C26.6947 23.5693 27.1172 23.1683 27.4024 22.6739C27.688 22.1799 27.8241 " +
                                                " 21.6135 27.7941 21.0437C27.7641 20.4738 27.5694 19.9249 27.2335 19.4635L26.1047 " +
                                                " 17.9124C25.7027 17.356 25.4879 16.6863 25.4913 15.9998C25.4912 15.3153 25.708 " +
                                                " 14.6483 26.1106 14.0947L27.2395 12.5435C27.5753 12.0822 27.77 11.5333 27.8 " +
                                                " 10.9634C27.83 10.3935 27.6939 9.82723 27.4084 9.33317C27.1232 8.83882 26.7007 " +
                                                " 8.43782 26.1921 8.17881C25.6835 7.91979 25.1107 7.81388 24.5432 7.87391L22.6365 " +
                                                " 8.07687C21.9556 8.14838 21.2696 8.00267 20.6765 7.66058C20.086 7.31751 19.6193 " +
                                                " 6.79631 19.3432 6.17169L18.558 4.4191C18.3263 3.8974 17.9483 3.45412 17.4697 " +
                                                " 3.14304C16.9911 2.83195 16.4325 2.66641 15.8617 2.6665C15.2909 2.66641 14.7323 " +
                                                " 2.83195 14.2537 3.14304C13.7751 3.45412 13.3971 3.8974 13.1654 4.4191L12.3861 " +
                                                " 6.17169C12.11 6.79631 11.6433 7.31751 11.0528 7.66058C10.4598 8.00267 9.7737 " +
                                                " 8.14838 9.09281 8.07687L7.18021 7.87391C6.61265 7.81388 6.03986 7.91979 5.5313 " +
                                                " 8.17881C5.02273 8.43782 4.60023 8.83882 4.31503 9.33317C4.02945 9.82723 3.8934 " +
                                                " 10.3935 3.92338 10.9634C3.95336 11.5333 4.14808 12.0822 4.48392 12.5435L5.6128 " +
                                                " 14.0947C6.01539 14.6483 6.23219 15.3153 6.23206 15.9998C6.23219 16.6844 6.01539 " +
                                                " 17.3514 5.6128 17.905L4.48392 19.4561C4.14808 19.9175 3.95336 20.4664 3.92338 " +
                                                " 21.0363C3.8934 21.6061 4.02945 22.1725 4.31503 22.6665C4.60051 23.1606 5.02307 " +
                                                " 23.5614 5.53156 23.8204C6.04005 24.0793 6.6127 24.1854 7.18021 24.1258L9.08688 " +
                                                " 23.9228C9.76777 23.8513 10.4538 23.997 11.0469 24.3391C11.6396 24.6812 12.1085 " +
                                                " 25.2025 12.3861 25.828Z"} strokeWidth="2"
                                                strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </Tab>
                        </TabList>

                        <div onClick={() => logout()} className="logout">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d={"M20.0214 9.85265V8.60865C20.0214 5.89531 17.8214 3.69531 15.108 3.69531H8.60804C5.89604 " +
                                    " 3.69531 3.69604 5.89531 3.69604 8.60865V23.4486C3.69604 26.162 5.89604 28.362 8.60804 " +
                                    " 28.362H15.1214C17.8267 28.362 20.0214 26.1686 20.0214 23.4633V22.206"}
                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M29.0793 16.0285H13.0247" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d={"M25.1749 12.1416L29.0789 16.0283L25.1749 19.9163"} strokeWidth="2"
                                    strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>

                    </div>
                    <div className="tab-panel">
                        <TabPanel>
                            <ProjectsTab getProjects={getProjects} isLoading={isLoading} />
                        </TabPanel>
                        <TabPanel>
                            <p>Empty panel</p>
                        </TabPanel>
                        <TabPanel>
                            <SettingsTab />
                        </TabPanel>
                    </div>
                </div>

            </Tabs>
        </div>
    );
});

export default UserPage;