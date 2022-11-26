import { useState } from 'react';
//import { useRootStore } from '../../providers/rootProvider';
import { Collapse } from 'react-collapse';
import { IProject } from '../../model/Project';

interface IPagesPanelProps {
    currentProject: IProject,
    updateProjectCallback: (page: IProject) => void,
}

const PagesPanel = ({ currentProject, updateProjectCallback }: IPagesPanelProps) => {
    const [collapsePanelIsOpen, setCollapsePanelIsOpen] = useState<boolean>(false);

    return (
        <div id="pagesPanel">
            <div className="collapse-panel" data-hidden={!collapsePanelIsOpen}>
                <p
                    aria-expanded={collapsePanelIsOpen}
                    onClick={() => setCollapsePanelIsOpen(!collapsePanelIsOpen)}
                    className="collapsedPanel-head btn">
                    {currentProject.getCurrentPage().title}
                </p>
                <Collapse isOpened={collapsePanelIsOpen}>
                    <div>
                        {currentProject.getPages().map(page => {
                            return <p key={page.id} className='collapseItem' onClick={() => {
                                setCollapsePanelIsOpen(false);
                                currentProject.setCurrentPage(page.id);
                                updateProjectCallback(currentProject);
                            }}>{page.title}</p>
                        })}
                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default PagesPanel;