import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { projectMicroservice, userMicroservice } from "../../../common/axiosMicroservices";
import IProjectMeta from "../../../model/projectData/IProjectMeta";
import { LanguageData, useLanguageContext } from "../../../providers/languageProvider";
import { useRootStore } from "../../../providers/rootProvider";
import { TProjectsMetaStore } from "../../../stores/projectsMetaStore";
import { TUserStore } from "../../../stores/userStore";
import GroupTreeElement from "./GroupTreeElement";

interface IMoveModalFormProps{
    projectMeta: IProjectMeta,
    close: () => void,
    updateProjects: () => void
}

const MoveModalForm: React.FC<IMoveModalFormProps> = observer(({projectMeta, close, updateProjects}) => {
    const lang: LanguageData | null = useLanguageContext();
    const [selectedGroupId, setSelectedGroupId] = useState<string>('');
    const [showError, setShowError] = useState<boolean>(false);

    const userStore: TUserStore = useRootStore()!.getUserStore();
    const projectsMetaStore: TProjectsMetaStore = useRootStore()!.getProjectsMetaStore();

    const moveProject = async () => {
        if (selectedGroupId === ''){
            setShowError(true);
            return;
        }
        const res = await projectMicroservice.post('moveProjectToGroup', {
            id: projectMeta.id,
            groupId: selectedGroupId
        })
        if (res.status === 200){
            projectsMetaStore.switchMoveFormById(projectMeta.id);
            updateProjects();
        }
    }
    
    return (
        <React.Fragment>
            <div className="modal">
                <div className="show-form-container">
                    <div className="show-form-panel">
                        <div className="show-form-header">
                            <div className="show-form-title">
                                {lang?.langText.userPage.projectTab.moveForm.title+"'"+projectMeta.name+"'"}
                            </div>
                            <div className="close-icon" onClick={() => close()}>x
                            </div>
                        </div>
                        
                        <div className="show-form-data">
                        {
                            projectsMetaStore.getData().filter(p => p.isGroup)
                                .filter(g => g.groupId === null || g.ownerId !== userStore.getData()?.id)
                                .map(g => (<GroupTreeElement name={g.name} id={g.id} 
                                    setSelectedGroupId={setSelectedGroupId}
                                    selectedGroupId={selectedGroupId}
                                    projects={projectsMetaStore.getData()} shift={0}/>))
                        }
                        </div>

                        <div className="btn-row">
                            <button className="move-btn" onClick={() => moveProject()}>Ok</button>
                            {
                                showError && <div className="error-text">
                                    {lang?.langText.userPage.projectTab.moveForm.emptyGroupError}
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
})

export default MoveModalForm;