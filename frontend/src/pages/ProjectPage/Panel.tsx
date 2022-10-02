import React from "react";
import { observer } from "mobx-react-lite"
import { useProjectStore } from "../../providers/projectProvider";

export const Panel: React.FC = observer(() => {
    const projectStore = useProjectStore()

    return (
        <>
        { 
            projectStore?.allElements.map(item => <p>{item}</p>)
        }
        </>
    )
})