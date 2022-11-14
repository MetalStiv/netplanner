import React, { SyntheticEvent, useState } from 'react';
//import { useRootStore } from '../providers/rootProvider';
import { Collapse } from 'react-collapse';

const PagesPanel: React.FC = () => {
    //const userStore = useRootStore()?.getUserStore()

    const [collapsePanelIsOpen, setCollapsePanelIsOpen] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<string>('Page 1');

    const pageButtonClickHandler = (e: SyntheticEvent<HTMLElement, MouseEvent>) => {
        setCurrentPage(e.currentTarget.innerText);
        setCollapsePanelIsOpen(false);
    }
    return (
        <div id="pagesPanel">
            <div className="collapse-panel" data-hidden={!collapsePanelIsOpen}>
                <p aria-expanded={collapsePanelIsOpen} onClick={() => setCollapsePanelIsOpen(!collapsePanelIsOpen)} className="collapsedPanel-head btn">{currentPage}</p>
                <Collapse isOpened={collapsePanelIsOpen}>
                    <div>
                        <p className='collapseItem' onClick={(e) => pageButtonClickHandler(e)}>Page 1</p>
                        <p className='collapseItem' onClick={(e) => pageButtonClickHandler(e)}>Page 2</p>
                        <p className='collapseItem' onClick={(e) => pageButtonClickHandler(e)}>Page 3</p>
                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default PagesPanel;