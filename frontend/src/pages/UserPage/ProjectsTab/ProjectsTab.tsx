import React, { useEffect, useCallback } from "react";
import '../../../styles/home/projects/index.scss';
import { useRootStore } from "../../../providers/rootProvider";
import { TProjectsMetaStore } from "../../../stores/projectsMetsStore";
import { projectMicroservice, userMicroservice } from "../../../common/axiosMicroservices";
import ProjectCard from "./ProjectCard";
import IProjectMeta from "../../../model/IProjectMeta";
import { observer } from "mobx-react-lite";
import { TUsersStore } from "../../../stores/usersStore";
import useLanguage from "../../../hooks/useLanguage";

const ProjectsTab: React.FC = observer(() => {
    const projectsMetaStore: TProjectsMetaStore = useRootStore()!.getProjectsMetaStore();
    const usersStore: TUsersStore = useRootStore()!.getUsersStore();

    const [, , , langText] = useLanguage();

    const getUsers = useCallback(async (projects: IProjectMeta[]) => {
        const userIds: Set<string> = new Set<string>();
        projects.forEach((project: IProjectMeta) => {
            userIds.add(project.ownerId);
            if (project.subscriberIds){
                project.subscriberIds.forEach(id => userIds.add(id))
            }
        });
        const users = await userMicroservice.get('getUsersByIds', { params: {ids: Array.from(userIds)}})
        if (users.status === 200){
            usersStore?.setData(users.data)
        }
    }, [usersStore])

    const getProjects = useCallback(async () => {
        let projects = await projectMicroservice.get('getProjects')
        if (projects.status === 200){
            const data = projects.data.map((item: IProjectMeta) => ({...item, "hide": false}));
            await getUsers(data)
            projectsMetaStore?.setData(data)
        }
    }, [projectsMetaStore, getUsers])

    const addProject = async () => {
        let addProject = await projectMicroservice.post('addProject', {
            "name": langText.userPage.projectTab.defaultName
        })
        if (addProject.status !== 200){
            alert(addProject.statusText)
        }
        projectsMetaStore.updateOrInsert(addProject.data)
    }

    useEffect(() => {
        getProjects()
    }, [getProjects])

    return (
        <div id="projectsTab">
        {
            projectsMetaStore?.getData().length === 0 ? <div className="startMenu">
                    <div className="text">{langText.userPage.projectTab.startNewProject}</div>
                    <button type="submit" className="add-btn" onClick={addProject}>+</button>
                </div>
                : <>
                    <div className="text text-transformed">{langText.userPage.projectTab.startNewProject}</div>
                    <button type="submit" className="add-btn add-btn-transformed" onClick={addProject}>+</button>
                    <div id="project-card-container">
                    {
                        projectsMetaStore?.getData().map((p, index) => 
                            <ProjectCard 
                                projectId={p.id} 
                                key={`card_${p.id}`} 
                            />)
                    }
                    </div>
                </>
        }
        </div>

    );
})

export default ProjectsTab;