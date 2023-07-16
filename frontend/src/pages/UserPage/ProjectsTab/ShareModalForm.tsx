import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { projectMicroservice, userMicroservice } from "../../../common/axiosMicroservices";
import IUser from "../../../model/IUser";
import IInvite from "../../../model/projectData/IInvite";
import IProjectMeta from "../../../model/projectData/IProjectMeta";
import { LanguageData, useLanguageContext } from "../../../providers/languageProvider";
import { useRootStore } from "../../../providers/rootProvider";
import { TUsersStore } from "../../../stores/usersStore";

interface IShareModalFormProps {
    projectMeta: IProjectMeta,
    close: () => void,
    updateProjects: () => void
}

const ShareModalForm: React.FC<IShareModalFormProps> = observer(({ projectMeta, close, updateProjects }) => {
    const lang: LanguageData | null = useLanguageContext();
    const [emailValue, setEmailValue] = useState<string>();
    const [permissionValue, setPermissionValue] = useState<string>('0');

    const usersStore: TUsersStore = useRootStore()!.getUsersStore();

    const sendInvite = async () => {
        const invite = await projectMicroservice.post('sendInvite', {
            projectId: projectMeta.id,
            email: emailValue,
            permission: permissionValue,
        })
        if (invite.status === 200) {
            updateProjects()
        }
    }

    const revokeInvite = async (id: string) => {
        const invite = await projectMicroservice.delete('revokeInvite', { data: { id: id } })
        if (invite.status === 200) {
            updateProjects()
        }
    }

    return (
        <React.Fragment>
            <div className="modal">
                <div className="show-form-container">
                    <div className="show-form-panel">
                        <div className="show-form-header">
                            <div className="show-form-title">
                                {lang?.langText.userPage.projectTab.sharingForm.title + projectMeta.name}
                            </div>
                            <div className="close-icon" onClick={() => close()}>x
                            </div>
                        </div>

                        <div className="show-form-sent-form">
                            <input
                                className='show-form-sent-input'
                                autoFocus={true}
                                type="text"
                                placeholder={lang?.langText.userPage.projectTab.sharingForm.enterEmail}
                                value={emailValue}
                                onChange={e => setEmailValue(e.currentTarget.value)}
                            />

                            <select className="show-form-sent-permission" value={permissionValue}>
                                <option value='0' onClick={() => setPermissionValue('0')}>{lang?.langText.userPage.projectTab.sharingForm.fullAccess}</option>
                                <option value='1' onClick={() => setPermissionValue('1')}>{lang?.langText.userPage.projectTab.sharingForm.readonly}</option>
                            </select>

                            <div className="show-form-sent-button" onClick={sendInvite}>
                                {lang?.langText.userPage.projectTab.sharingForm.invite}
                            </div>
                        </div>

                        <div className="show-form-data">
                            {
                                projectMeta.invites.map(i => (
                                    <div className="invite-data-row" key={i.id}>
                                        <div className="invite-data-icon">
                                            <img src={usersStore.getData()?.find(u => u.id === i.userId)!.avatarBase64} />
                                        </div>
                                        <div className="invite-data-user-name">{usersStore.getData().find(u => u.id === i.userId)?.name}</div>
                                        <div className="invite-data-permission">{i.permission === 0 ? lang?.langText.userPage.projectTab.sharingForm.fullAccess :
                                            lang?.langText.userPage.projectTab.sharingForm.readonly}</div>
                                        <div className="invite-data-state">
                                            {
                                                i.state === 0 ? <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="15" cy="15" r="13.5" stroke="#FED059" strokeWidth="3" />
                                                    <path d="M12 5L15 16" stroke="#FED059" strokeWidth="2" strokeLinecap="round" />
                                                    <path d="M20 20L15 15.88" stroke="#FED059" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                                    : i.state === 1 ? <svg width="31" height="29" viewBox="0 0 31 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M3 13.2903L13.4167 27" stroke="#80FF54" strokeWidth="4" strokeLinecap="round" />
                                                        <path d="M28 2L14.4583 26.1935" stroke="#80FF54" strokeWidth="4" strokeLinecap="round" />
                                                    </svg>
                                                        : <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M26 2L3 27" stroke="#FF7557" strokeWidth="4" strokeLinecap="round" />
                                                            <path d="M3.91992 2L25.9999 27" stroke="#FF7557" strokeWidth="4" strokeLinecap="round" />
                                                        </svg>
                                            }
                                        </div>
                                        <button className="invite-data-revoke-button" onClick={() => revokeInvite(i.id)}>
                                            {lang?.langText.userPage.projectTab.sharingForm.revoke}
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
})

export default ShareModalForm;