import React, { SyntheticEvent, useState } from 'react';
import IUser from '../../model/IUser';
import avatar from '../../assets/images/user-avatar.png';
import { useRootStore } from '../../providers/rootProvider';
//import { useRootStore } from '../providers/rootProvider';

const HeaderNavbar: React.FC = () => {
    const userStore = useRootStore()?.getUserStore()

    const [collapsePanelIsOpen, setCollapsePanelIsOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<string>('Page 1');

    const pageButtonClickHandler = (e: SyntheticEvent<HTMLElement, MouseEvent>) => {
        setCurrentPage(e.currentTarget.innerText);
        setCollapsePanelIsOpen(false);
    }

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
                            // users.map((user, i) => {
                            //     return <a key={user.name + i} href='' className='user-image'><img key={user.id + i} src={user.avatarBase64} alt={user.name} /></a>
                            // })
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