import React, { SyntheticEvent, useState } from 'react';
import IUser from '../../model/IUser';
import avatar from '../../assets/images/user-avatar.png';
//import { useRootStore } from '../providers/rootProvider';

const HeaderNavbar: React.FC = () => {
    //const userStore = useRootStore()?.getUserStore()

    const [collapsePanelIsOpen, setCollapsePanelIsOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<string>('Page 1');

    const pageButtonClickHandler = (e: SyntheticEvent<HTMLElement, MouseEvent>) => {
        setCurrentPage(e.currentTarget.innerText);
        setCollapsePanelIsOpen(false);
    }

    const [currentUser, setCurrentUser] = useState<IUser>({
        id: '000000001',
        email: 'qwerty@mail.ru',
        name: 'Христорождественский Константин Константинович',
        avatarbase64: avatar,
    });

    const [users, setUsers] = useState<IUser[]>([currentUser]);

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
                            users.map((user, i) => {
                                return <a key={user.name + i} href='' className='user-image'><img key={user.id + i} src={user.avatarbase64} alt={user.name} /></a>
                            })
                        }
                    </div>
                    <div className="">
                        <button className='share-btn'>SHARE</button>
                    </div>
                </div>
                <a href='' className="current-user">
                    <p className='name'>{currentUser.name}</p>
                    <img className='user-image' src={currentUser.avatarbase64} alt={currentUser.name} />
                </a>
            </div>
        </div>
    )
}

export default HeaderNavbar;