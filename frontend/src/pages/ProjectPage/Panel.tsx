import React from "react";
import { observer } from "mobx-react-lite"
import { useRootStore } from "../../providers/rootProvider";

export const Panel: React.FC = observer(() => {
    const projectStore = useRootStore()?.getProjectStore()

    return (
        <>
            {
                projectStore?.getProjects().map(item => <p>{item.name}</p>)
            }
        </>
    )
})