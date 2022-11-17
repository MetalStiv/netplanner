import React, { useState } from 'react';
//import { useRootStore } from '../providers/rootProvider';
import { Collapse } from 'react-collapse';
import IShapesGroup from '../model/IShapesGroup';

interface IDropdownProps {
    title: string,
    children: React.ReactNode
}

const Dropdown = ({ title, children }: IDropdownProps) => {
    //const userStore = useRootStore()?.getUserStore()

    const [collapsePanelIsOpen, setCollapsePanelIsOpen] = useState<boolean>(false);

    return (
        <div className="collapse-panel" data-hidden={!collapsePanelIsOpen}>
            <p aria-expanded={collapsePanelIsOpen} onClick={() => setCollapsePanelIsOpen(!collapsePanelIsOpen)} className="collapsedPanel-head btn">{title}</p>
            <Collapse isOpened={collapsePanelIsOpen}>
                {children}
            </Collapse>
        </div>
    )
}

export default Dropdown;