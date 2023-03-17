import { useState } from 'react';
//import { useRootStore } from '../../providers/rootProvider';
import { Collapse } from 'react-collapse';
import { useClickAndDoubleClickHandler } from '../../../common/customHooks/useClickAndDoubleClickHandler';
//import Page from '../../../model/Page';
import { IProject } from '../../../model/Project';
import useLanguage from "../../../common/customHooks/useLanguage";

interface PagesPanelProps {
    currentProject: IProject,
    //updateProjectCallback: (pages: Page[]) => void,
}

const PagesPanel = ({ currentProject }: PagesPanelProps) => {
    const [collapsePanelIsOpen, setCollapsePanelIsOpen] = useState<boolean>(false);
    const [editingPageIndex, setEditingPageIndex] = useState<number>(-1);
    const [title, setTitle] = useState<string>("");
    const [, , , langText] = useLanguage();
    const titleClickHandler = useClickAndDoubleClickHandler(
        (e, page) => {
            selectPageHandler(page.id);
        },
        (e, page, i) => {
            setEditingPageIndex(i);
            setTitle(page.title);
        });


    function selectPageHandler(pageID: number) {
        setCollapsePanelIsOpen(false);
        currentProject.setCurrentPage(pageID);
        console.log(currentProject.getCurrentPage())
        //updateProjectCallback(currentProject.getPages());
    }

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
                            return <div key={page.id} className='collapseItem' onClick={() => selectPageHandler(page.id)}>
                                <span style={{ display: editingPageIndex === i ? 'none' : 'inline', cursor: "text" }}
                                    className='page-title'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        titleClickHandler(e, page, i);
                                    }}
                                >{page.title}</span>
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
                            //updateProjectCallback(currentProject.getPages());
                            setEditingPageIndex(currentProject.getPages().length - 1);
                        }
                        }>{langText.projectPage.pagesPanel.addBtn}</p>
                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default PagesPanel;