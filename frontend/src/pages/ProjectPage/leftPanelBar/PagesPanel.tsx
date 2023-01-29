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
    const [editingPageIndex, setEditingPageIndex] = useState<number>(-1);
    const [title, setTitle] = useState<string>("");

    const changeTitleHandler = (el: HTMLInputElement, pageID: number) => {
        setEditingPageIndex(-1);
        let newTitle = el.value.trim();

        if (newTitle.length) {
            newTitle = currentProject.titleUniqueization(newTitle, pageID);

            currentProject.setPages(currentProject.getPages().map(item => {
                if (item.id === pageID) {
                    item.title = newTitle;
                }
                return item;
            }))
            setTitle("");
        }
    }

    const inputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle((e.target as HTMLInputElement).value);
    }

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
                        {currentProject.getPages().map((page, i) => {
                            return <div key={page.id} className='collapseItem' onClick={() => {
                                setCollapsePanelIsOpen(false);
                                currentProject.setCurrentPage(page.id);
                                updateProjectCallback(currentProject.getPages());
                            }}>

                                <span style={{ display: editingPageIndex === i ? 'none' : 'inline', cursor: "text" }}
                                    className='page-title'
                                    onClick={e => e.stopPropagation()}
                                    onDoubleClick={e => {
                                        e.stopPropagation();
                                        setEditingPageIndex(i);
                                        setTitle(page.title);
                                    }}>{page.title}</span>
                                {
                                    (editingPageIndex === i) && <input
                                        className='change-name-input'
                                        autoFocus={true}
                                        onClick={e => e.stopPropagation()}
                                        type="text"
                                        onBlur={e => changeTitleHandler(e.target, page.id)}
                                        value={title}
                                        onChange={inputTitle}
                                        onKeyDown={e => {
                                            if (e.keyCode === 13) {
                                                changeTitleHandler(e.target, page.id);
                                            }
                                        }} />
                                }
                            </div>
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