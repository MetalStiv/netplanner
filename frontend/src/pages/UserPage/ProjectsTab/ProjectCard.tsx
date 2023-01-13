import React, { useState } from "react";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import IProjectMeta from "../../../model/IProjectMeta";
import { useTransition, animated } from 'react-spring';

interface IProjectCardProps {
    projectMeta: IProjectMeta;
    orderToRender: number;
    removeCallback: () => void;
}

const ProjectCard: React.FC<IProjectCardProps> = ({projectMeta, orderToRender, removeCallback}) => {
    const [state, _] = useState<boolean>(true)
    const transition = useTransition(state, {
        from: {
            x: 0, 
            y: 200, 
            opacity: 0,
            config: {
                duration: 200
            }
        },
        enter: {
            x: 0, 
            y: 0, 
            opacity: 1,
            delay: 250*orderToRender,
            config: {
                duration: 300
            }
        },
        leave: {
            x: 800, 
            y: 0,
            opacity: 0,
            config: {
                duration: 800
            }
        },
        unique: true
    });

    return (
        <>
        {
            transition((style, item) => 
                item && 
                <animated.div style={style} className="project-card">
                    <img className="project-image" src="" />
                    <div className="base-info">
                        <div className="modified-info">Just created</div>
                        <div className="name-info">{projectMeta.name}</div>
                        <div className="owner-info">Owner {projectMeta.ownerId}</div>
                    </div>
                    <div className="separator"></div>
                    <div className="btn-block">
                        <ConfirmationDialog btnShowText={"Delete"} btnAcceptText={"Delete"}
                            btnDeclineText={"Close"} questionTextPartOne="Are you shure you want to delete project"
                            questionTextPartTwo={projectMeta.name}
                            action={removeCallback} />
                    </div>
                </animated.div>
            )
        }
        </>
    )
}

export default ProjectCard;