import React, { useCallback, useEffect, useRef, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SettingsTab from "./SettingsTab/SettingsTab";
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
import { useNavigate } from "react-router-dom";

const UserPage: React.FC = observer(() => {
  const lang: LanguageData | null = useLanguageContext();
  const logout = useLogout();
  const usersStore: TUsersStore = useRootStore()!.getUsersStore();
  const userStore: TUserStore = useRootStore()!.getUserStore();
  const projectsMetaStore: TProjectsMetaStore = useRootStore()!.getProjectsMetaStore();

  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showUpdates, setShowUpdates] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const projectsTabRef = useRef<HTMLDivElement>(null);
  const settingsTabRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
    if (users.status === 401) {
      navigate("/");
    }
  }, [usersStore])

  const getActiveInvites = useCallback(async () => {
    const invites = await projectMicroservice.get<IInvite[]>('getActiveInvites')
    if (invites.status === 200) {
      userStore?.setInvites(invites.data)
    }
    if (invites.status === 401) {
      navigate("/");
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
    if (projects.status === 401) {
      navigate("/");
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
    if (res.status === 401) {
      navigate("/");
    }
  };

  const declineInvite = async (id: string) => {
    const res = await projectMicroservice.post("/declineInvite", {
      id: id
    })
    if (res.status === 200) {
      getProjects()
    }
    if (res.status === 401) {
      navigate("/");
    }
  };

  const getUserInfo = useCallback(async () => {
    const res = await userMicroservice.get<IUser>("/whois")
    if (res.status === 200) {
      userStore.setData(res.data)
    }
    if (res.status === 401) {
      navigate("/");
    }
  }, [])

  useEffect(() => {
    getUserInfo();
    getProjects();

    const interval = setInterval(() => {
      getUserInfo();
      getProjects();
    }, updateInfoTime)
    return () => clearInterval(interval)
  }, [getProjects])

  return (
    <div id="userPage">
      {
        (userStore.getUpdates().length > 0 && showUpdates) &&
        <div className="modal">
          <div className="show-form-container">
            <div className="show-form-panel">
              <div className="show-form-header">
                <div className="show-form-title">
                  {lang?.langText.userPage.updateModalHeader + userStore.getData()!.appVersion!.toString()}
                </div>
                <div className="close-icon" onClick={() => { console.log(userStore.getData()); setShowUpdates(false) }}>x
                </div>
              </div>

              <div className="show-form-data">
                {
                  <ul>
                    {
                      userStore.getUpdates().map((u, ind) => <li key={'update_' + ind}>{u}</li>)
                    }
                  </ul>
                }
              </div>
            </div>
          </div>
        </div>
      }

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
          <button onClick={() => setShowMenu(!showMenu)} className="arrow">
            <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5.5 5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
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

          {
            showNotifications && <div className="notification-menu-container">
              <div className="notification-menu-tail" style={{ right: (nameRef.current?.clientWidth! + 140) }}>
              </div>

              <div className="notification-menu" style={{ right: (nameRef.current?.clientWidth! + 100) }}>
                <div className="panel-notification">
                  {
                    userStore.getInvites().length === 0 ?
                      lang!.langText.headerMenu.noMessages
                      : userStore.getInvites().map((i, index) => <div className="notification" key={i.id}>
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
        </div>

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
            <TabList>
              <Tab>
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
              </Tab>
              <Tab>
                <div className="menu-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 122.88 101.37">
                    <path d="M12.64,77.27l0.31-54.92h-6.2v69.88c8.52-2.2,17.07-3.6,25.68-3.66c7.95-0.05,15.9,1.06,23.87,3.76 c-4.95-4.01-10.47-6.96-16.36-8.88c-7.42-2.42-15.44-3.22-23.66-2.52c-1.86,0.15-3.48-1.23-3.64-3.08 C12.62,77.65,12.62,77.46,12.64,77.27L12.64,77.27z M103.62,19.48c-0.02-0.16-0.04-0.33-0.04-0.51c0-0.17,0.01-0.34,0.04-0.51V7.34 c-7.8-0.74-15.84,0.12-22.86,2.78c-6.56,2.49-12.22,6.58-15.9,12.44V85.9c5.72-3.82,11.57-6.96,17.58-9.1 c6.85-2.44,13.89-3.6,21.18-3.02V19.48L103.62,19.48z M110.37,15.6h9.14c1.86,0,3.37,1.51,3.37,3.37v77.66 c0,1.86-1.51,3.37-3.37,3.37c-0.38,0-0.75-0.06-1.09-0.18c-9.4-2.69-18.74-4.48-27.99-4.54c-9.02-0.06-18.03,1.53-27.08,5.52 c-0.56,0.37-1.23,0.57-1.92,0.56c-0.68,0.01-1.35-0.19-1.92-0.56c-9.04-4-18.06-5.58-27.08-5.52c-9.25,0.06-18.58,1.85-27.99,4.54 c-0.34,0.12-0.71,0.18-1.09,0.18C1.51,100.01,0,98.5,0,96.64V18.97c0-1.86,1.51-3.37,3.37-3.37h9.61l0.06-11.26 c0.01-1.62,1.15-2.96,2.68-3.28l0,0c8.87-1.85,19.65-1.39,29.1,2.23c6.53,2.5,12.46,6.49,16.79,12.25 c4.37-5.37,10.21-9.23,16.78-11.72c8.98-3.41,19.34-4.23,29.09-2.8c1.68,0.24,2.88,1.69,2.88,3.33h0V15.6L110.37,15.6z M68.13,91.82c7.45-2.34,14.89-3.3,22.33-3.26c8.61,0.05,17.16,1.46,25.68,3.66V22.35h-5.77v55.22c0,1.86-1.51,3.37-3.37,3.37 c-0.27,0-0.53-0.03-0.78-0.09c-7.38-1.16-14.53-0.2-21.51,2.29C79.09,85.15,73.57,88.15,68.13,91.82L68.13,91.82z M58.12,85.25 V22.46c-3.53-6.23-9.24-10.4-15.69-12.87c-7.31-2.8-15.52-3.43-22.68-2.41l-0.38,66.81c7.81-0.28,15.45,0.71,22.64,3.06 C47.73,78.91,53.15,81.64,58.12,85.25L58.12,85.25z" fill="white" strokeWidth="4" />
                  </svg>
                </div>
              </Tab>
              <Tab>
                <div ref={settingsTabRef} className="menu-icon">
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