import React, { useState } from "react";
import { ConfirmationDialog } from "../../../components";
import IProjectMeta from "../../../model/projectData/IProjectMeta";
import { useRootStore } from "../../../providers/rootProvider";
import { TUsersStore } from "../../../stores/usersStore";
import { observer } from "mobx-react-lite";
import { projectMicroservice } from "../../../common/axiosMicroservices";
import { TProjectsMetaStore } from "../../../stores/projectsMetaStore";
import { useNavigate } from "react-router-dom";
import imageLoadingPlaceholder from '../../../assets/images/image-loading.jpg';
import { LanguageData, useLanguageContext } from "../../../providers/languageProvider";
import ShareModalForm from "./ShareModalForm";
import MoveModalForm from "./MoveModalForm";

interface IProjectCardProps {
    projectId: string,
    updateProjects: () => void,
}

const ProjectCard: React.FC<IProjectCardProps> = observer(({ projectId, updateProjects }) => {
    const projectsMetaStore: TProjectsMetaStore = useRootStore()!.getProjectsMetaStore();
    const usersStore: TUsersStore = useRootStore()!.getUsersStore();
    const lang: LanguageData | null = useLanguageContext();

    const navigate = useNavigate();

    const [isEdittingName, setIsEdittingName] = useState<boolean>(false);
    const [tempName, setTempName] = useState<string>(projectsMetaStore.getById(projectId)!.name);

    const maxSubscriberQuantity: number = 8;

    const removeProject = async () => {
        const res = await projectMicroservice.delete("removeProject", { data: { id: projectId } })
        if (res.status !== 200) {
            alert(res.statusText)
        }
        // projectsMetaStore.hideById(projectId);
        if (res.status === 401) {
            navigate("/");
        }
        updateProjects();
    }

    const changeName = (el: HTMLInputElement) => {
        setTempName(el.value)
    }

    const saveNameHandler = async () => {
        const res = await projectMicroservice.post("renameProject", {
            id: projectId,
            name: tempName
        });
        if (res.status === 200) {
            const newProjectMeta: IProjectMeta = projectsMetaStore.getById(projectId)!;
            newProjectMeta.name = tempName;
            projectsMetaStore.updateOrInsert(newProjectMeta);
            setIsEdittingName(false);
        }
        if (res.status === 401) {
            navigate("/");
        }
    }

    const getLastModifiedString = (date: Date) => {
        const currentDateTime = new Date();
        const difInSec: number = Math.floor((currentDateTime.getTime() - date.getTime()) / 1000);
        const diffInMin: number = Math.floor(difInSec / 60);
        const diffInHour: number = Math.floor(diffInMin / 60);
        const diffInDay: number = Math.floor(diffInHour / 24);
        const diffInMonth: number = Math.floor(diffInDay / 30);
        const diffInYear: number = Math.floor(diffInMonth / 12);
        const lastMonth: number = diffInMonth - diffInYear * 12;
        const lastDay: number = diffInDay - (lastMonth + diffInYear * 12) * 30;
        const lastHour: number = diffInHour - (lastDay + (lastMonth + diffInYear * 12) * 30) * 24;
        const lastMin: number = diffInMin - (lastHour + (lastDay + (lastMonth + diffInYear * 12) * 30) * 24) * 60;

        const data: string = diffInYear > 0 ?
            diffInMonth > 0 ?
                diffInDay > 0 ?
                    diffInYear + lang!.langText.userPage.projectTab.yearAbbreviation + ' '
                    + lastMonth + lang!.langText.userPage.projectTab.monthAbbreviation + ' ' + lastDay
                    + lang!.langText.userPage.projectTab.dayAbbreviation
                    : diffInYear + lang!.langText.userPage.projectTab.yearAbbreviation + ' ' + lastMonth
                    + lang!.langText.userPage.projectTab.monthAbbreviation
                : diffInYear + lang!.langText.userPage.projectTab.yearAbbreviation
            : lastMonth > 0 ?
                lastDay > 0 ?
                    lastHour > 0 ?
                        lastMonth + lang!.langText.userPage.projectTab.monthAbbreviation + ' ' + lastDay
                        + lang!.langText.userPage.projectTab.dayAbbreviation + ' ' + lastHour
                        + lang!.langText.userPage.projectTab.hourAbbreviation
                        : lastMonth + lang!.langText.userPage.projectTab.monthAbbreviation + ' ' + lastDay +
                        lang!.langText.userPage.projectTab.dayAbbreviation
                    : lastMonth + lang!.langText.userPage.projectTab.monthAbbreviation
                : lastDay > 0 ?
                    lastHour > 0 ?
                        lastMin > 0 ?
                            lastDay + lang!.langText.userPage.projectTab.dayAbbreviation + ' ' + lastHour
                            + lang!.langText.userPage.projectTab.hourAbbreviation + ' '
                            + lastMin + lang!.langText.userPage.projectTab.minAbbreviation
                            : lastDay + lang!.langText.userPage.projectTab.dayAbbreviation + ' ' + lastHour
                            + lang!.langText.userPage.projectTab.hourAbbreviation + ' '
                        : lastDay + lang!.langText.userPage.projectTab.dayAbbreviation
                    : lastHour > 0 ?
                        lastMin > 0 ?
                            lastHour + lang!.langText.userPage.projectTab.hourAbbreviation + ' ' + lastMin
                            + lang!.langText.userPage.projectTab.minAbbreviation
                            : lastHour + lang!.langText.userPage.projectTab.hourAbbreviation
                        : lastMin > 0 ?
                            lastMin + lang!.langText.userPage.projectTab.minAbbreviation
                            : lang!.langText.userPage.projectTab.lessThenAMinute

        return lang!.langText.userPage.projectTab.modified + ' ' + data + ' ' + lang!.langText.userPage.projectTab.ago;
    }

    return (
        <div className="project-card-container">
            <div className={`project-card ${projectsMetaStore.getById(projectId)!.hide ?
                "project-card-hidden"
                : "project-card-visible"}`}
                onDoubleClick={() => {
                    navigate(`/project?id=${projectsMetaStore.getById(projectId)!.id}`)
                }}>
                <div className="project-meta">
                    <div className="project-image">
                        <img className="" src={imageLoadingPlaceholder}
                            onClick={() => navigate(`/project?id=${projectsMetaStore.getById(projectId)!.id}`)} />
                    </div>
                    <div className="base-info">
                        <div className="controls-bar">
                            <div className="modified-info">{
                                getLastModifiedString(new Date(projectsMetaStore.getById(projectId)!.lastModifyTime))
                            }</div>
                            <div className="menu-icon-group">
                                {
                                    projectsMetaStore.getById(projectId)!.userRights === 0 ?
                                        <div className="full-rights-icon">{lang?.langText.userPage.projectTab.sharingForm.fullAccess}</div>
                                        : projectsMetaStore.getById(projectId)!.userRights === 1 ?
                                            <div className="readonly-rights-icon">{lang?.langText.userPage.projectTab.sharingForm.readonly}</div>
                                            : ''
                                }

                                <button className="menu-icon" onClick={() => projectsMetaStore.switchShareFormById(projectId)}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d={"M7 11.5L13 14.5M13 5.5L7 8.5M16 19C14.3431 19 13 17.6569 13 16C13 14.3431 14.3431 " +
                                            " 13 16 13C17.6569 13 19 14.3431 19 16C19 17.6569 17.6569 19 16 19ZM4 13C2.34315 13 1 " +
                                            " 11.6569 1 10C1 8.34315 2.34315 7 4 7C5.65685 7 7 8.34315 7 10C7 11.6569 5.65685 13 " +
                                            " 4 13ZM16 7C14.3431 7 13 5.65685 13 4C13 2.34315 14.3431 1 16 1C17.6569 1 19 2.34315 " +
                                            " 19 4C19 5.65685 17.6569 7 16 7Z"} stroke="#292C33" strokeWidth="2"
                                            strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>

                                <button className="menu-icon" onClick={() => projectsMetaStore.switchMenuById(projectId)}>
                                    <svg width="4" height="17" viewBox="0 0 4 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d={"M1 14.9286C1 15.5203 1.44772 16 2 16C2.55228 16 3 15.5203 3 14.9286C3 14.3368 2.55228 " +
                                            " 13.8571 2 13.8571C1.44772 13.8571 1 14.3368 1 14.9286Z"} fill="#292C33" />
                                        <path d={"M1 8.5C1 9.09173 1.44772 9.57143 2 9.57143C2.55228 9.57143 3 9.09173 3 8.5C3 7.90827 " +
                                            " 2.55228 7.42857 2 7.42857C1.44772 7.42857 1 7.90827 1 8.5Z"} fill="#292C33" />
                                        <path d={"M1 2.07143C1 2.66316 1.44772 3.14286 2 3.14286C2.55228 3.14286 3 2.66316 3 2.07143C3 " +
                                            " 1.47969 2.55228 1 2 1C1.44772 1 1 1.47969 1 2.07143Z"} fill="#292C33" />
                                        <path d={"M1 14.9286C1 15.5203 1.44772 16 2 16C2.55228 16 3 15.5203 3 14.9286C3 14.3368 2.55228 " +
                                            " 13.8571 2 13.8571C1.44772 13.8571 1 14.3368 1 14.9286Z"} stroke="#292C33"
                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d={"M1 8.5C1 9.09173 1.44772 9.57143 2 9.57143C2.55228 9.57143 3 9.09173 3 8.5C3 7.90827 " +
                                            " 2.55228 7.42857 2 7.42857C1.44772 7.42857 1 7.90827 1 8.5Z"} stroke="#292C33"
                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d={"M1 2.07143C1 2.66316 1.44772 3.14286 2 3.14286C2.55228 3.14286 3 2.66316 3 " +
                                            " 2.07143C3 1.47969 2.55228 1 2 1C1.44772 1 1 1.47969 1 2.07143Z"} stroke="#292C33"
                                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                {
                                    projectsMetaStore.getById(projectId)!.showMenu &&
                                    <div className="panel-menu-container">
                                        <div className="panel-menu">
                                            <div className="menu-text disabled">
                                                {lang!.langText.userPage.projectTab.createCheckpoint}
                                            </div>
                                            <hr className="separator" />
                                            <div className="menu-text disabled">
                                                {lang!.langText.userPage.projectTab.restoreFromCheckpoint}
                                            </div>
                                            <hr className="separator" />
                                            <div className="menu-text" onClick={() => {
                                                projectsMetaStore.switchMenuById(projectId);
                                                projectsMetaStore.switchMoveFormById(projectId);
                                            }}>
                                                {lang!.langText.userPage.projectTab.moveToGroup}
                                            </div>
                                            <hr className="separator" />
                                            <div className="menu-text">
                                                <ConfirmationDialog showText={lang!.langText.userPage.projectTab.delete}
                                                    btnAcceptText={lang!.langText.userPage.projectTab.delete}
                                                    btnDeclineText={lang!.langText.userPage.projectTab.cancel}
                                                    questionTextPartOne={lang!.langText.userPage.projectTab.deleteProjectQuestion}
                                                    questionTextPartTwo={projectsMetaStore.getById(projectId)!.name}
                                                    questionTextPartThree={lang!.langText.userPage.projectTab.deleteProjectDefinition}
                                                    action={removeProject} />
                                            </div>
                                        </div>

                                        <div className="tail">
                                        </div>
                                    </div>
                                }
                                {
                                    projectsMetaStore.getById(projectId)!.showSharingForm &&
                                    <ShareModalForm projectMeta={projectsMetaStore.getById(projectId)!}
                                        close={() => projectsMetaStore.switchShareFormById(projectId)}
                                        updateProjects={updateProjects} />
                                }
                                {
                                    projectsMetaStore.getById(projectId)!.showSharingForm &&
                                    <ShareModalForm projectMeta={projectsMetaStore.getById(projectId)!}
                                        close={() => projectsMetaStore.switchShareFormById(projectId)}
                                        updateProjects={updateProjects} />
                                }
                                {
                                    projectsMetaStore.getById(projectId)!.showMoveForm &&
                                    <MoveModalForm projectMeta={projectsMetaStore.getById(projectId)!}
                                        close={() => projectsMetaStore.switchMoveFormById(projectId)}
                                        updateProjects={updateProjects} />
                                }
                            </div>
                        </div>
                        {
                            isEdittingName ? <div className="name-container">
                                <input
                                    className='change-name-input'
                                    autoFocus={true}
                                    type="text"
                                    onBlur={saveNameHandler}
                                    value={tempName}
                                    onChange={e => changeName(e.target)}
                                    onKeyDown={e => {
                                        if (e.keyCode === 13) {
                                            saveNameHandler();
                                        }
                                        if (e.keyCode === 27) {
                                            setIsEdittingName(false);
                                            setTempName(projectsMetaStore.getById(projectId)!.name);
                                        }
                                    }}
                                />
                            </div>
                                : <div className="name-container">
                                    <p className="name-info">
                                        {projectsMetaStore.getById(projectId)!.name}
                                    </p>
                                    <button className="pencil-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            onClick={() => setIsEdittingName(true)}>
                                            <path d="M4 20.0001H3C3 20.2653 3.10536 20.5197 3.2929 20.7072C3.48043 
                                        20.8948 3.73479 21.0001 4.00001 21.0001L4 20.0001ZM4 16.0001L3.29289 
                                        15.293C3.10536 15.4805 3 15.7349 3 16.0001H4ZM14.8686 5.13146L14.1615 
                                        4.42435L14.1615 4.42436L14.8686 5.13146ZM17.1313 5.13146L16.4242 
                                        5.83857V5.83857L17.1313 5.13146ZM18.8686 6.86872L19.5757 6.16162V6.16162L18.8686 
                                        6.86872ZM18.8686 9.13146L18.1615 8.42436V8.42436L18.8686 9.13146ZM8 
                                        20.0001L8.00001 21.0001C8.26522 21.0001 8.51957 20.8947 8.70711 
                                        20.7072L8 20.0001ZM19.5369 7.69112L20.4879 7.3821L19.5369 7.69112ZM19.5369 
                                        8.30908L18.5858 8.00006L19.5369 8.30908ZM15.691 4.46325L15.382 
                                        3.51219V3.51219L15.691 4.46325ZM16.3091 4.46325L16.6181 3.51219V3.51219L16.3091 
                                        4.46325ZM12.7071 7.29301C12.3166 6.90248 11.6834 6.90248 11.2929 
                                        7.29301C10.9024 7.68353 10.9024 8.3167 11.2929 8.70722L12.7071 
                                        7.29301ZM15.2929 12.7072C15.6834 13.0977 16.3166 13.0977 16.7071 
                                        12.7072C17.0976 12.3167 17.0976 11.6835 16.7071 11.293L15.2929 12.7072ZM5 
                                        20.0001V16.0001H3V20.0001H5ZM4.70711 16.7072L15.5757 5.83857L14.1615 
                                        4.42436L3.29289 15.293L4.70711 16.7072ZM16.4242 5.83857L18.1615 7.57583L19.5757 
                                        6.16162L17.8385 4.42436L16.4242 5.83857ZM18.1615 8.42436L7.29289 19.293L8.70711 
                                        20.7072L19.5757 9.83857L18.1615 8.42436ZM7.99999 19.0001L3.99999 19.0001L4.00001 
                                        21.0001L8.00001 21.0001L7.99999 19.0001ZM18.1615 7.57583C18.3712 7.7855 18.4854 
                                        7.9008 18.5611 7.98999C18.6292 8.07026 18.6058 8.06155 18.5858 8.00014L20.4879 
                                        7.3821C20.3938 7.09237 20.2342 6.87046 20.0858 6.69562C19.9449 6.5297 19.7621 
                                        6.34796 19.5757 6.16162L18.1615 7.57583ZM19.5757 9.83857C19.7621 9.65222 19.9449 
                                        9.47049 20.0858 9.30456C20.2342 9.12971 20.3938 8.90781 20.4879 8.61809L18.5858 
                                        8.00006C18.6058 7.93867 18.6292 7.92995 18.5611 8.01021C18.4854 8.09939 18.3712 
                                        8.21469 18.1615 8.42436L19.5757 9.83857ZM18.5858 8.00014L18.5858 8.00006L20.4879 
                                        8.61809C20.6184 8.2164 20.6184 7.78379 20.4879 7.3821L18.5858 8.00014ZM15.5757 
                                        5.83857C15.7854 5.62891 15.9007 5.51472 15.9899 5.43903C16.0701 5.3709 16.0614 
                                        5.39436 16 5.41431L15.382 3.51219C15.0923 3.60632 14.8704 3.76588 14.6955 
                                        3.91432C14.5296 4.05517 14.3479 4.238 14.1615 4.42435L15.5757 5.83857ZM17.8385 
                                        4.42436C17.6522 4.23806 17.4704 4.05522 17.3046 3.91439C17.1298 3.76596 16.9079 
                                        3.60634 16.6181 3.51219L16.0001 5.41431C15.9386 5.39434 15.9299 5.37083 16.0101 
                                        5.43896C16.0993 5.51468 16.2145 5.62885 16.4242 5.83857L17.8385 4.42436ZM16 
                                        5.41431H16.0001L16.6181 3.51219C16.2164 3.38168 15.7837 3.38168 15.382 3.51219L16 
                                        5.41431ZM11.2929 8.70722L15.2929 12.7072L16.7071 11.293L12.7071 7.29301L11.2929 
                                        8.70722Z" fill="#176DEA" />
                                        </svg>
                                    </button>
                                </div>
                        }

                        <div className="owner-info">{lang!.langText.userPage.projectTab.owner + ': '}
                            <img src={
                                usersStore.getData()
                                    .find(u => u.id === projectsMetaStore.getById(projectId)!.ownerId)?.avatarBase64
                            } />
                            <div className="owner-name">
                                {
                                    usersStore.getData()
                                        .find(u => u.id === projectsMetaStore.getById(projectId)!.ownerId)?.name
                                }
                            </div>
                        </div>
                        <div className="subscribers-info">{lang!.langText.userPage.projectTab.subscribers + ': '}
                            {
                                projectsMetaStore.getById(projectId)!.invites !== undefined ?
                                    projectsMetaStore.getById(projectId)!.invites.filter(i => i.state === 1).length > 0 ?
                                        projectsMetaStore.getById(projectId)!.invites.filter(i => i.state === 1)
                                            .map((i, index) =>
                                                index < maxSubscriberQuantity ? <img key={'im_' + i.id} src={
                                                    usersStore.getData()
                                                        .find(u => u.id === i.userId)?.avatarBase64
                                                } title={usersStore.getData().find(u => u.id === i.userId)?.name} />
                                                    : index === maxSubscriberQuantity ? <div className="addition-subscribers" onClick={() => projectsMetaStore.switchShareFormById(projectId)}
                                                        title={projectsMetaStore.getById(projectId)!.invites.filter(i => i.state === 1).map((i, index) =>
                                                            index < maxSubscriberQuantity ? ''
                                                                : usersStore.getData().find(u => u.id === i.userId)?.name
                                                        ).filter(item => item !== '').join(', ')}>
                                                        {'+' + (projectsMetaStore.getById(projectId)!.invites.filter(i => i.state === 1).length -
                                                            maxSubscriberQuantity)}
                                                    </div>
                                                        : ''
                                            )
                                        : lang!.langText.userPage.projectTab.none
                                    : lang!.langText.userPage.projectTab.none
                            }
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
})

export default ProjectCard;