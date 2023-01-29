import { useState } from 'react';
//import { useRootStore } from '../../providers/rootProvider';
import { Collapse } from 'react-collapse';
import Page from '../../../model/Page';
import { IProject } from '../../../model/Project';

interface PagesPanelProps {
    currentProject: IProject,
    updateProjectCallback: (pages: Page[]) => void,
}

const PagesPanel = ({ currentProject, updateProjectCallback }: PagesPanelProps) => {
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
                                updateProjectCallback(currentProject.getPages());
                            }}>{page.title}</p>
                        })}
                        <p id="addPage-btn" onClick={() => {
                            currentProject.addPage();
                            updateProjectCallback(currentProject.getPages());
                            setCollapsePanelIsOpen(false);
                        }
                        }>Add page</p>
                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default PagesPanel;