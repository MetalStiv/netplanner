import React, { useRef, useState } from "react";
import bookImage from '../../assets/images/Book.png';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import SettingsTab from "./SettingsTab";
import ProjectsTab from "./ProjectsTab/ProjectsTab";
import useLogout from "../../common/customHooks/useLogout";
import { observer } from "mobx-react-lite";
import { useRootStore } from "../../providers/rootProvider";
import { TUserStore } from "../../stores/userStore";
import { TProjectsMetaStore } from "../../stores/projectsMetaStore";
import { LanguageData, useLanguageContext } from "../../providers/languageProvider";

const UserPage: React.FC = observer(() => {
    const lang: LanguageData | null = useLanguageContext();
    const logout = useLogout();
    const userStore: TUserStore = useRootStore()!.getUserStore();
    const projectsMetaStore: TProjectsMetaStore = useRootStore()!.getProjectsMetaStore();
    
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const projectsTabRef = useRef<HTMLDivElement>(null);
    const settingsTabRef = useRef<HTMLDivElement>(null);

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
                        onClick={() => setShowMenu(!showMenu)} style={{cursor: 'pointer'}}>
                        <path d="M1 1L5.5 5L10 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <div className="user-avatar">
                        <img src={
                            userStore.getData()?.avatarBase64
                        } onClick={() => setShowMenu(!showMenu)} style={{cursor: 'pointer'}} />
                    </div>
                    <div className="user-name">
                    {
                        userStore.getData()?.name
                    }
                    </div>
                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg"
                        style={{cursor: 'pointer'}}>
                        <path d={"M11.8572 17.4285C11.0953 18.5714 10.1429 19.1428 9.00005 19.1428C7.8572 19.1428 "+
                            " 6.90482 18.5714 6.14291 17.4285M14.8109 15.7143H3.18917C2.14727 15.7143 1.30264 "+
                            " 14.8696 1.30264 13.8277C1.30264 13.4858 1.39557 13.1503 1.57148 12.8571C2.69322 "+
                            " 10.9875 3.28577 8.84826 3.28577 6.66799V5.42854C3.28577 2.90381 5.33247 0.857109 "+
                            " 7.8572 0.857109H10.1429C12.6676 0.857109 14.7143 2.90381 14.7143 5.42854V6.66799C14.7143 "+
                            " 8.84826 15.3069 10.9875 16.4286 12.8571C16.9647 13.7505 16.675 14.9094 15.7816 "+
                            " 15.4454C15.4884 15.6213 15.1529 15.7143 14.8109 15.7143V15.7143Z"}
                             stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
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
                        <TabList>
                            <div className="logo">
                                <svg width="43" height="48" viewBox="0 0 43 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d={"M0 1.48438C0 0.883284 0.485025 0.395996 1.08333 0.395996H11.9167C12.515 0.395996 "+
                                        " 13 0.883282 13 1.48438V46.4709C13 47.072 12.515 47.5593 11.9167 47.5593H1.08333C0.485025 "+
                                        " 47.5593 0 47.072 0 46.4709V1.48438Z"} fill="#176DEA"/>
                                    <path d={"M29 1.48438C29 0.883284 29.5223 0.395996 30.1667 0.395996H41.8333C42.4777 0.395996 "+
                                        " 43 0.883282 43 1.48438V46.4709C43 47.072 42.4777 47.5593 41.8333 47.5593H30.1667C29.5223 "+
                                        "47.5593 29 47.072 29 46.4709V1.48438Z"} fill="#176DEA"/>
                                    <path d={"M2.0062 8.18811C1.66569 7.70048 1.7932 7.03317 2.29101 6.69764L11.3265 0.607506C11.8243 "+
                                        "0.271974 12.5039 0.395271 12.8444 0.882899L40.0287 39.8118C40.3692 40.2995 40.2417 40.9668 "+
                                        " 39.7439 41.3023L30.7084 47.3924C30.2106 47.728 29.531 47.6047 29.1905 47.117L2.0062 8.18811Z"}
                                        fill="#176DEA"/>
                                </svg>
                            </div>

                            <Tab>
                                <div className="rectangle first-rectangle">
                                    <div ref={projectsTabRef} className="menu-icon">
                                        <svg width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.9934 20.2359V16.8533" stroke="#949494" stroke-width="2" 
                                                stroke-linecap="round" stroke-linejoin="round"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d={"M22.2532 5.10693C24.5065 5.10693 26.3198 "+
                                                " 6.9336 26.3198 9.18693V13.7736C23.0398 15.6936 18.7065 16.8536 13.9865 16.8536C9.2665 "+
                                                " 16.8536 4.9465 15.6936 1.6665 13.7736V9.1736C1.6665 6.92027 3.49317 5.10693 5.7465 "+
                                                "5.10693H22.2532Z"} stroke-width="2" stroke-linecap="round" 
                                                stroke-linejoin="round"/>
                                            <path d={"M18.6601 5.10117V4.61317C18.6601 2.9865 17.3401 1.6665 15.7134 "+
                                                " 1.6665H12.2734C10.6468 1.6665 9.32678 2.9865 9.32678 4.61317V5.10117"} 
                                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d={"M1.69922 18.644L1.95122 21.9894C2.12189 24.244 4.00055 25.9867 6.26055 "+
                                                " 25.9867H21.7259C23.9859 25.9867 25.8646 24.244 26.0352 21.9894L26.2872 18.644"} 
                                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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
                                            <path d={"M16.0007 19.9998C18.2098 19.9998 20.0007 18.209 20.0007 15.9998C20.0007 13.7907 "+
                                                " 18.2098 11.9998 16.0007 11.9998C13.7916 11.9998 12.0007 13.7907 12.0007 "+
                                                " 15.9998C12.0007 18.209 13.7916 19.9998 16.0007 19.9998Z"} stroke="white" 
                                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <path d={"M12.3861 25.828L13.1654 27.5806C13.3971 28.1023 13.7751 28.5456 14.2537 "+
                                                " 28.8566C14.7323 29.1677 15.2909 29.3333 15.8617 29.3332C16.4325 29.3333 16.9911 "+
                                                " 29.1677 17.4697 28.8566C17.9483 28.5456 18.3263 28.1023 18.558 27.5806L19.3372 "+
                                                " 25.828C19.6146 25.2061 20.0813 24.6877 20.6706 24.3465C21.2636 24.0044 21.9497 "+
                                                " 23.8587 22.6306 23.9302L24.5373 24.1332C25.1048 24.1932 25.6776 24.0873 26.1862 "+
                                                " 23.8283C26.6947 23.5693 27.1172 23.1683 27.4024 22.6739C27.688 22.1799 27.8241 "+
                                                " 21.6135 27.7941 21.0437C27.7641 20.4738 27.5694 19.9249 27.2335 19.4635L26.1047 "+
                                                " 17.9124C25.7027 17.356 25.4879 16.6863 25.4913 15.9998C25.4912 15.3153 25.708 "+
                                                " 14.6483 26.1106 14.0947L27.2395 12.5435C27.5753 12.0822 27.77 11.5333 27.8 "+
                                                " 10.9634C27.83 10.3935 27.6939 9.82723 27.4084 9.33317C27.1232 8.83882 26.7007 "+
                                                " 8.43782 26.1921 8.17881C25.6835 7.91979 25.1107 7.81388 24.5432 7.87391L22.6365 "+
                                                " 8.07687C21.9556 8.14838 21.2696 8.00267 20.6765 7.66058C20.086 7.31751 19.6193 "+
                                                " 6.79631 19.3432 6.17169L18.558 4.4191C18.3263 3.8974 17.9483 3.45412 17.4697 "+
                                                " 3.14304C16.9911 2.83195 16.4325 2.66641 15.8617 2.6665C15.2909 2.66641 14.7323 "+
                                                " 2.83195 14.2537 3.14304C13.7751 3.45412 13.3971 3.8974 13.1654 4.4191L12.3861 "+
                                                " 6.17169C12.11 6.79631 11.6433 7.31751 11.0528 7.66058C10.4598 8.00267 9.7737 "+
                                                " 8.14838 9.09281 8.07687L7.18021 7.87391C6.61265 7.81388 6.03986 7.91979 5.5313 "+
                                                " 8.17881C5.02273 8.43782 4.60023 8.83882 4.31503 9.33317C4.02945 9.82723 3.8934 "+
                                                " 10.3935 3.92338 10.9634C3.95336 11.5333 4.14808 12.0822 4.48392 12.5435L5.6128 "+
                                                " 14.0947C6.01539 14.6483 6.23219 15.3153 6.23206 15.9998C6.23219 16.6844 6.01539 "+
                                                " 17.3514 5.6128 17.905L4.48392 19.4561C4.14808 19.9175 3.95336 20.4664 3.92338 "+
                                                " 21.0363C3.8934 21.6061 4.02945 22.1725 4.31503 22.6665C4.60051 23.1606 5.02307 "+
                                                " 23.5614 5.53156 23.8204C6.04005 24.0793 6.6127 24.1854 7.18021 24.1258L9.08688 "+
                                                " 23.9228C9.76777 23.8513 10.4538 23.997 11.0469 24.3391C11.6396 24.6812 12.1085 "+
                                                " 25.2025 12.3861 25.828Z"} stroke-width="2" 
                                                stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                </div>
                            </Tab>
                        </TabList>

                        <div onClick={() => logout()} className="logout">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d={"M20.0214 9.85265V8.60865C20.0214 5.89531 17.8214 3.69531 15.108 3.69531H8.60804C5.89604 "+
                                    " 3.69531 3.69604 5.89531 3.69604 8.60865V23.4486C3.69604 26.162 5.89604 28.362 8.60804 "+
                                    " 28.362H15.1214C17.8267 28.362 20.0214 26.1686 20.0214 23.4633V22.206"} 
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M29.0793 16.0285H13.0247" stroke-width="2"stroke-linecap="round" stroke-linejoin="round"/>
                                <path d={"M25.1749 12.1416L29.0789 16.0283L25.1749 19.9163"} stroke-width="2" 
                                    stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>

                    </div>
                    <div className="tab-panel">
                        <TabPanel>
                            <ProjectsTab />
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