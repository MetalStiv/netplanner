import React, { useState } from 'react';
import { Collapse } from 'react-collapse';

interface IDropdownProps {
    title: string,
    children: React.ReactNode
}

const Dropdown = ({ title, children }: IDropdownProps) => {
    const [collapsePanelIsOpen, setCollapsePanelIsOpen] = useState<boolean>(false);

    return (
        <div className="collapse-panel" data-hidden={!collapsePanelIsOpen}>
            <p aria-expanded={collapsePanelIsOpen} onClick={() => 
                setCollapsePanelIsOpen(!collapsePanelIsOpen)} className="collapsedPanel-head btn">{title}</p>
            <Collapse isOpened={collapsePanelIsOpen}>
                {children}
            </Collapse>
        </div>
    )
}

export default Dropdown;