import { useEffect, useState } from 'react';
//import { useRootStore } from '../../providers/rootProvider';
import { Collapse } from 'react-collapse';
import { useClickAndDoubleClickHandler } from '../../../common/customHooks/useClickAndDoubleClickHandler';
//import Page from '../../../model/Page';
import { LanguageData, useLanguageContext } from '../../../providers/languageProvider';
import titleUniqueization from '../../../common/_helpers/titleUniquezation';
import Project, { IProject } from '../../../model/projectData/Project';
import { AddPageAction } from '../../../model/actions/AddPageAction';
import { useRootStore } from '../../../providers/rootProvider';
import { TActionStore } from '../../../stores/actionStore';
import { TProjectStore } from '../../../stores/projectStore';
import { RenamePageAction } from '../../../model/actions/RenamePage';
import { observer } from 'mobx-react-lite';

// interface PagesPanelProps {
//     currentProject: IProject,
//     //updateProjectCallback: (pages: Page[]) => void,
// }

const PagesPanel = observer(() => {
    const [collapsePanelIsOpen, setCollapsePanelIsOpen] = useState<boolean>(false);
    const [editingPageIndex, setEditingPageIndex] = useState<number>(-1);
    const [title, setTitle] = useState<string>("");

    const lang: LanguageData | null = useLanguageContext();

    const actionStore: TActionStore = useRootStore().getActionStore();
    const projectStore: TProjectStore = useRootStore().getProjectStore();

    let currentProject = projectStore.getProject()!;
    // const [currentProject, setCurrentProject] = useState<IProject>();

    // useEffect(() => {
    //     project ?? setCurrentProject(project);
    // }, [project]);

    const titleClickHandler = useClickAndDoubleClickHandler(
        (e, page) => {
            selectPageHandler(page.id);
        },
        (e, page, i) => {
            setEditingPageIndex(i);
            setTitle(page.title);
        });

    function selectPageHandler(pageID: string) {
        setCollapsePanelIsOpen(false);
        currentProject.setCurrentPage(pageID);
        projectStore.update();
    }

    const changeTitleHandler = (el: HTMLInputElement, pageId: string) => {
        setEditingPageIndex(-1);
        let newTitle = el.value.trim();

        if (newTitle.length) {
            // newTitle = titleUniqueization(newTitle, currentProject.getPages(), pageID);

            // currentProject.setPages(currentProject.getPages().map(item => {
            //     if (item.getID() === pageID) {
            //         item.setTitle(newTitle);
            //     }
            //     return item;
            // }))
            const page = projectStore.getProject()!.getPages().find(p => p.getID() === pageId)
            const renamePageAction = new RenamePageAction(page!, newTitle);
            actionStore.push(renamePageAction);
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
                    {currentProject.getCurrentPage().getTitle()}
                </p>
                <Collapse isOpened={collapsePanelIsOpen}>
                    <div>
                        {currentProject.getPages().map((page, i) => {
                            return <div key={page.getID()} className='collapseItem' onClick={() => selectPageHandler(page.getID())}>
                                <span style={{ display: editingPageIndex === i ? 'none' : 'inline', cursor: "text" }}
                                    className='page-title'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        titleClickHandler(e, page, i);
                                    }}
                                >{page.getTitle()}</span>
                                {
                                    (editingPageIndex === i) && <input
                                        className='change-name-input'
                                        autoFocus={true}
                                        onClick={e => e.stopPropagation()}
                                        type="text"
                                        onBlur={e => changeTitleHandler(e.target, page.getID())}
                                        value={title}
                                        onChange={inputTitle}
                                        onKeyDown={e => {
                                            if (e.keyCode === 13) {
                                                changeTitleHandler(e.target, page.getID());
                                            }
                                        }} />
                                }
                            </div>
                        })}
                        <p id="addPage-btn" onClick={() => {
                            // currentProject.addPage();
                            const addPageAction = new AddPageAction(currentProject);
                            actionStore.push(addPageAction);
                            setEditingPageIndex(currentProject.getPages().length);
                        }
                        }>{lang?.langText.projectPage.pagesPanel.addBtn}</p>
                    </div>
                </Collapse>
            </div>
        </div>
    )
})

export default PagesPanel;