import React, { SyntheticEvent, useState } from 'react';
import IUser from '../../model/IUser';
import avatar from '../../assets/images/user-avatar.png';
import { useRootStore } from '../../providers/rootProvider';
//import { useRootStore } from '../providers/rootProvider';

const HeaderNavbar: React.FC = () => {
    const userStore = useRootStore()?.getUserStore()
    const usersStore = useRootStore()?.getUsersStore()
    const projectStore = useRootStore()?.getProjectStore()

    const [collapsePanelIsOpen, setCollapsePanelIsOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<string>('Page 1');

    const pageButtonClickHandler = (e: SyntheticEvent<HTMLElement, MouseEvent>) => {
        setCurrentPage(e.currentTarget.innerText);
        setCollapsePanelIsOpen(false);
    }

    const maxCursorQuantity: number = 5;

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
                                            return <div key={u.name+u.id} style={{position: 'relative'}}>
                                                <img key={"icon_"+u.id} src={u.avatarBase64} alt={u.name} title={u.name} 
                                                    style={{border: '2px solid '+c.color, marginTop: '1vh', height: '28px', width: '28px', borderRadius: '50%'}}/>
                                                <svg style={{position: 'absolute', marginTop: '1vh', top: '0', left: '0'}} height="38" width="38">
                                                    <title>{u.name}</title>
                                                    <circle cx='27' cy='27' r='5' fill={c.color} />
                                                </svg>
                                            </div>
                                        }
                                        if (index === maxCursorQuantity){
                                            return <div className="user-cursor-addictive">
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
                        <button className='share-btn'>SHARE</button>
                    </div>
                </div>
                <div className="current-user">
                    <p className='name'>{userStore?.getData()?.name}</p>
                    <img className='user-image' src={userStore?.getData()?.avatarBase64} alt={userStore?.getData()?.name} />
                </div>
            </div>
        </div>
    )
}

export default HeaderNavbar;