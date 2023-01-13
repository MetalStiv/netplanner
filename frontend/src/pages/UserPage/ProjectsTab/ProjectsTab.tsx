import React, { useEffect, useCallback } from "react";
import '../../../styles/home/projects/index.scss';
import { useRootStore } from "../../../providers/rootProvider";
import { TProjectsMetaStore } from "../../../stores/projectsMetsStore";
import { projectMicroservice } from "../../../common/axiosMicroservices";
import ProjectCard from "./ProjectCard";
import { observer } from "mobx-react-lite"
import { resourceUsage } from "process";

const ProjectsTab: React.FC = observer(() => {
    const projectsMetaStore: TProjectsMetaStore = useRootStore()!.getProjectsMetaStore();

    const getProjects = useCallback(async () => {
        let projects = await projectMicroservice.get('getProjects')
        if (projects.status === 200){
            projectsMetaStore?.setData(projects.data)
        }
    }, [projectsMetaStore])

    const addProject = async () => {
        let projects = await projectMicroservice.post('addProject')
        if (projects.status !== 200){
            alert(projects.statusText)
        }
        getProjects()
    }

    const removeProject = async (id: string) => {
        const res = await projectMicroservice.post("removeProject", {id: id})
        if (res.status !== 200){
            alert(res.statusText)
        }
        getProjects()
    }

    useEffect(() => {
        getProjects()
    }, [getProjects])

    return (
        <div id="projectsTab">
        {
            projectsMetaStore?.getData().length === 0 ? <div className="startMenu">
                    <div className="text">Start a new project</div>
                    <button type="submit" className="add-btn" onClick={addProject}>+</button>
                </div>
                : <>
                    <div className="text text-transformed">Start a new project</div>
                    <button type="submit" className="add-btn add-btn-transformed" onClick={addProject}>+</button>
                    <div id="project-card-container">
                    {
                        projectsMetaStore?.getData().map((p, index) => 
                            <ProjectCard 
                                projectMeta={p} 
                                key={`card_${p.id}`} 
                                orderToRender={index} 
                                removeCallback={() => removeProject(p.id)}    
                            />)
                    }
                    </div>
                </>
        }
        </div>

    );
})

export default ProjectsTab;