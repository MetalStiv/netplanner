import { observer } from 'mobx-react-lite';
import React, { SyntheticEvent, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { logout } from '../../common/login';
import IUser from '../../model/IUser';
import { LanguageData, useLanguageContext } from '../../providers/languageProvider';
import { useRootStore } from '../../providers/rootProvider';
import { TProjectsMetaStore } from '../../stores/projectsMetaStore';
import { TProjectStore } from '../../stores/projectStore';
import { TUsersStore } from '../../stores/usersStore';
import { TUserStore } from '../../stores/userStore';
import ShareModalForm from '../UserPage/ProjectsTab/ShareModalForm';

interface IHeaderNavbarProps {
    update: () => void,
}

const HeaderNavbar: React.FC<IHeaderNavbarProps> = observer(({update}) => {
    const userStore: TUserStore = useRootStore()?.getUserStore();
    const usersStore: TUsersStore = useRootStore()?.getUsersStore();
    const projectStore: TProjectStore = useRootStore()?.getProjectStore();
    const projectsMetaStore: TProjectsMetaStore = useRootStore()!.getProjectsMetaStore();

    const [collapsePanelIsOpen, setCollapsePanelIsOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<string>('Page 1');
    const [showSharingForm, setShowSharingForm] = useState<boolean>(false);
    const [showCursorsPanel, setShowCursorsPanel] = useState<boolean>(false);
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const userCursorAddictive = useRef<HTMLDivElement | null>(null);

    const lang: LanguageData | null = useLanguageContext();
    const navigate = useNavigate();
    
    const pageButtonClickHandler = (e: SyntheticEvent<HTMLElement, MouseEvent>) => {
        setCurrentPage(e.currentTarget.innerText);
        setCollapsePanelIsOpen(false);
    }

    const maxCursorQuantity: number = 6;
    
    return (
        <div id="header-navbar">
            <div className="options">
                <button className='btn'>Unload</button>
                <button className='btn'>Savepoints</button>
            </div>
            <div className="users-data">
                <div className="left-part">
                    <div className="users">
                        {
                            projectStore.getProject()?.getCursors()!
                                .filter(c => c.userId !== userStore.getData()?.id)!
                                .map((c, index) => {
                                        if (index < maxCursorQuantity){ 
                                            const u: IUser = usersStore.getData()?.find(u => u.id === c.userId)!;
                                            return u ? <div key={u.name+u.id} style={{position: 'relative'}}>
                                                <img key={"icon_"+u.id} src={u.avatarBase64} alt={u.name} title={u.name} 
                                                    style={{border: '2px solid '+c.color, marginTop: '1vh', height: '28px', width: '28px', borderRadius: '50%'}}/>
                                                <svg style={{position: 'absolute', marginTop: '1vh', top: '0', left: '0'}} height="38" width="38">
                                                    <title>{u.name}</title>
                                                    <circle cx='27' cy='27' r='5' fill={c.color} />
                                                </svg>
                                            </div>
                                            : ''
                                        }
                                        if (index === maxCursorQuantity){
                                            return <div ref={userCursorAddictive} className="user-cursor-addictive" onClick={() => setShowCursorsPanel(!showCursorsPanel)}>
                                                +{projectStore.getProject()?.getCursors()!.filter(c => c.userId !== userStore.getData()?.id)!.length!-maxCursorQuantity}
                                                </div>
                                        }
                                        if (index > maxCursorQuantity){
                                            return ''
                                        }
                                    }
                                )
                        }
                    </div>
                    <div className="">
                        <button className='share-btn' onClick={() => setShowSharingForm(true)}>SHARE</button>
                    </div>
                </div>
                <div className="current-user">
                    <p className='name'>{userStore?.getData()?.name}</p>
                    <img className='user-image' src={userStore?.getData()?.avatarBase64} alt={userStore?.getData()?.name} 
                        onClick={() => setShowMenu(!showMenu)} style={{ cursor: 'pointer' }}/>
                    <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg"
                        onClick={() => setShowMenu(!showMenu)} style={{ cursor: 'pointer', marginLeft: '6px' }}>
                        <path d="M1 1L5.5 5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>

            {
                showMenu &&
                    <div className="main-menu">
                        <div className="panel-menu">
                            <div className="menu-text" onClick={() => navigate('/home')}>
                                {lang!.langText.headerMenu.projects}
                            </div>
                            <hr className="separator" />
                            <div className="menu-text" onClick={() => {
                                logout();
                                navigate('/');
                            }}>
                                {lang!.langText.headerMenu.exit}
                            </div>
                        </div>
                    </div>
            }

            {
                showSharingForm &&
                    <ShareModalForm projectMeta={projectsMetaStore.getById(projectStore.getProject()?.getID()!)!} 
                        close={() => setShowSharingForm(false)} 
                        updateProjects={update} />
            }

            {
                showCursorsPanel && <div className="cursor-panel" style={{left: +(userCursorAddictive.current?.offsetLeft || 0)-250}}>
                    {
                        projectStore.getProject()?.getCursors()!
                            .filter(c => c.userId !== userStore.getData()?.id)!
                            .map((c, index) => {
                                if (index < maxCursorQuantity){
                                    return ''
                                }
                                else {
                                    const u: IUser = usersStore.getData()?.find(u => u.id === c.userId)!
                                    return u ? <>
                                        {
                                            index > maxCursorQuantity && <hr className="separator" />
                                        }
                                        <div className="addicitve-user-info">
                                            <img key={"icon_"+u.id} src={u.avatarBase64} alt={u.name}
                                                style={{border: '2px solid '+c.color, marginTop: '1vh', height: '28px', width: '28px', borderRadius: '50%'}}/>
                                            <div className="addicitve-user-name">
                                            {
                                                usersStore.getData().find(u => u.id === c.userId)?.name
                                            }
                                            </div>
                                        </div>
                                    </>
                                    : ''
                                }
                            })
                    }
                </div>
            }
        </div>
    )
})

export default HeaderNavbar;