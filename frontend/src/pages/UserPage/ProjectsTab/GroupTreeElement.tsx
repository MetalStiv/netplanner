import { useRef, useState } from "react";
import IProjectMeta from "../../../model/projectData/IProjectMeta";

interface IGroupTreeElement {
    name: string,
    id: string,
    projects: IProjectMeta[],
    shift: number,
    setSelectedGroupId: (id: string) => void,
    selectedGroupId: string,
}

const GroupTreeElement: React.FC<IGroupTreeElement> = ({name, id, projects, shift, setSelectedGroupId, selectedGroupId}) => {
    const [open, setOpen] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <div className={(id === selectedGroupId) ? " selected-group-tree-element" : "group-tree-element"} 
                onClick={() => {
                    setSelectedGroupId(id);
                }}>
                <span style={{marginRight: (shift*12)+'px'}}></span>
                {
                    open ? <span className="tree-element-icon" onClick={() => setOpen(!open)}>
                            <svg width="14" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L5.5 5L10 1" stroke="#434345" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                    
                        : <span className="tree-element-icon" onClick={() => setOpen(!open)}>
                            <svg width="14" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1.53198 10.5139L5.50006 5.98574L1.46833 1.51414" stroke="#434345" 
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </span>
                }
                {name}
            </div>

            {/* <div className="content-parent" ref={contentRef} style={open ? {height: contentRef.current!.scrollHeight+"px"} : {height: "0px"}}>
                <div className="content">
                {
                    projects
                        .filter(p => p.isGroup)
                        .filter(g => g.groupId === id)
                        .map(g => <GroupTreeElement name={g.name} id={g.id} projects={projects} 
                            setSelectedGroupId={setSelectedGroupId} selectedGroupId={selectedGroupId} shift={shift+1} />)
                }
                </div>
            </div> */}

            {
                open && <>
                    {
                        projects
                            .filter(p => p.isGroup)
                            .filter(g => g.groupId === id)
                            .map(g => <GroupTreeElement name={g.name} id={g.id} projects={projects} 
                                setSelectedGroupId={setSelectedGroupId} selectedGroupId={selectedGroupId} shift={shift+1} />)
                    }
                </>  
            }
        </>
    )
}

export default GroupTreeElement;