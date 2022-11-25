import React, { SyntheticEvent, useState } from 'react';
import { useRootStore } from '../../providers/rootProvider';
import { Collapse } from 'react-collapse';
import IPage from '../../model/Page'

const PagesPanel: React.FC = () => {
    const projectStore = useRootStore()?.getProjectStore();

    const [collapsePanelIsOpen, setCollapsePanelIsOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<string>
        (
            projectStore?.getProjects().at(0)!.getPages().find(page => {
                if (page.isCurrent) {
                    return page;
                }
            })!.title!
        );

    const pageButtonClickHandler = (e: SyntheticEvent<HTMLElement, MouseEvent>) => {
        setCurrentPage(e.currentTarget.innerText);
        setCollapsePanelIsOpen(false);
    }
    return (
        <div id="pagesPanel">
            <div className="collapse-panel" data-hidden={!collapsePanelIsOpen}>
                <p
                    aria-expanded={collapsePanelIsOpen}
                    onClick={() => setCollapsePanelIsOpen(!collapsePanelIsOpen)}
                    className="collapsedPanel-head btn">
                    {currentPage}
                </p>
                <Collapse isOpened={collapsePanelIsOpen}>
                    <div>
                        {projectStore?.getProjects().at(0)!.getPages().map(page => {
                            return <p key={page.id} className='collapseItem' onClick={(e) => {
                                pageButtonClickHandler(e);
                                projectStore.getProjects().at(0)?.pages.forEach(item => {
                                    if (item.isCurrent) {
                                        item.isCurrent = false;
                                    }
                                });
                                page.isCurrent = true;
                            }}>{page.title}</p>
                        })}
                        {/* <p className='collapseItem' onClick={(e) => pageButtonClickHandler(e)}>Page 1</p>
                        <p className='collapseItem' onClick={(e) => pageButtonClickHandler(e)}>Page 2</p>
                        <p className='collapseItem' onClick={(e) => pageButtonClickHandler(e)}>Page 3</p> */}
                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default PagesPanel;