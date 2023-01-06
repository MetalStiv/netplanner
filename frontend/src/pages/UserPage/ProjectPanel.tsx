import React, { useEffect, useState } from "react";
import IProjectMeta from "../../model/IProjectMeta";

interface IProjectPanelProps {
    projectMeta: IProjectMeta;
}

const ProjectPanel: React.FC<IProjectPanelProps> = ({projectMeta}) => {
    return <p>
        {projectMeta.id+' - '+projectMeta.name}
    </p>
}

export default ProjectPanel;