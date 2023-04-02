import {
    HorizontalPageSplit,
    VerticalPageSplit,
    Limit
} from 'react-page-split';
import 'react-page-split/style.css';

import ShapesPanel from './leftPanelBar/ShapesPanel';
import PagesPanel from './leftPanelBar/PagesPanel';
import LayersPanel from './leftPanelBar/LayersPanel';
import ObjectPropertiesPanel from './rightPanelBar/ObjectPropertiesPanel';
import GraphicalPropertiesPanel from './rightPanelBar/GraphicalPropertiesPanel';

//import '../../styles/project/index.scss';

//import { Panel } from './Panel';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import SVGCanvas from './SVGCanvas';
import IShapeCreator from '../../model/IShapeCreator';
import HeaderNavbar from './HeaderNavbar';
import { useRootStore } from '../../providers/rootProvider';
import Project, { IProject } from '../../model/Project';
import { IShapeGraphicalProps } from '../../model/IShape';
import ICanvasConfig, { Portrait } from "../../common/canvasConfig";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import AlertDialog from "../../components/AlertDialog";
import { projectMicroservice } from "../../common/axiosMicroservices";
import Loader from "../../components/Loader";
import RangeInput from "../../components/RangeInput";
import { LanguageData, useLanguageContext } from '../../providers/languageProvider';
import { ApplicationData, useApplicationContext } from '../../providers/applicationProvider';
// import { UndoAction } from '../../model/Action';

export interface IElemProps {
    type: string,
    size: { w: number, h: number },
    graphProps: IShapeGraphicalProps,
    //coords: { x: number, y: number },
}

export interface IDraggableElemProps {
    type: string,
}

const ProjectPage: React.FC = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const [canvasCursorCoords, setCanvasCursorCoords] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [selectedElemProps, setSelectedElemProps] = useState<IElemProps | null>(null);
    const [currentCreator, setCurrentCreator] = useState<IShapeCreator | null>(null);
    const [currentProject, setCurrentProject] = useState<IProject>(
        useRootStore()!.getProjectStore().getCurrentProject()
    );
    const [orientation,] = useState<ICanvasConfig>(Portrait);
    const [loading, setLoading] = useState<boolean>(false);
    const [projectUpdateError, setProjectUpdateError] = useState<boolean>(false);
    const workspaceDivRef = useRef<HTMLDivElement>(null);

    const lang: LanguageData | null = useLanguageContext();
    const app: ApplicationData | null = useApplicationContext();

    const updateProject = useCallback(async () => {
        setLoading(true)
        await new Promise(r => setTimeout(r, 1000));
        let project = await projectMicroservice.get('getProjectContent', {
            params: {
                id: params.get('id')
            }
        })
        if (project.status === 520) {
            setProjectUpdateError(true);
        }
        setLoading(false)
    }, [setProjectUpdateError])

    useEffect(() => {
        workspaceDivRef.current!.scrollTop = orientation.a4Height * Math.floor(orientation.heightInSheets / 2) - 150;
        workspaceDivRef.current!.scrollLeft = orientation.a4Width * Math.floor(orientation.widthInSheets / 2) - 150;
    }, [orientation, workspaceDivRef]);
    useEffect(() => {
        let newProject: IProject = new Project(currentProject.shapesGroups!, currentProject.title);
        newProject.setPages(currentProject.getPages());
        setCurrentProject(newProject);
    }, [currentProject]);
    // useEffect(() => {
    //     // workspaceDivRef.current!.scrollTo({top: 0, left: 0})
    //     const oldScale = scale;
    //     const oldTopScroll = workspaceDivRef.current!.scrollTop;
    //     const oldLeftScroll = workspaceDivRef.current!.scrollLeft;

    //     workspaceDivRef.current!.scrollTop = (workspaceDivRef.current!.scrollTop/workspaceDivRef.current!.scrollHeight)*parseInt(scale, 10)/100;
    //     workspaceDivRef.current!.scrollLeft = (workspaceDivRef.current!.scrollLeft/workspaceDivRef.current!.scrollWidth)
    //         *parseInt(scale, 10)/100;
    // }, [scale])

    // const pageObjCallback = useCallback((page: Page) => {
    //     let newProject: IProject = new Project(currentProject.shapesGroups!, currentProject.title);
    //     //newProject.copy(project);
    //     newProject.setPages(currentProject.getPages().map((pageItem: Page) => {
    //         if (pageItem.id === page.id) {
    //             pageItem = page;
    //         }
    //         return pageItem;
    //     }))
    //     //setCurrentProject(newProject);
    // }, [currentProject]);

    // const pagesArrCallback = useCallback((pages: Page[]) => {
    //     console.log(currentProject.getPages(), pages);
    //     //project.setPages(pages);
    //     //setCurrentProject(currentProject);
    // }, [currentProject]);

    const cursorCoordsCallback = useCallback((cursorCoords: { x: number, y: number }) => {
        setCanvasCursorCoords(cursorCoords);
    }, []);

    const draggableElemCallback = useCallback((creator: IShapeCreator) => {
        setCurrentCreator(creator);
    }, []);

    const clickedElemPropsCallback = useCallback((elemProps: IElemProps) => {
        setSelectedElemProps(elemProps);
    }, []);

    useEffect(() => {
        const onKeypress = (e: KeyboardEvent) => {
            console.log(e);
            if (e.ctrlKey && e.code === 'KeyZ') {
                // app?.addAction(new UndoAction(app.actionsHistory));
                app?.undo();
            }
        }

        document.addEventListener('keypress', onKeypress);

        return () => {
            document.removeEventListener('keypress', onKeypress);
        };
    }, []);

    return (
        <div id="projectPage">
            {
                loading && <Loader />
            }
            <AlertDialog
                btnText="Ok"
                text={lang!.langText.projectPage.notAllowed}
                isShown={projectUpdateError}
                onClose={() => navigate('/home')}
            />
            <header>
                <HeaderNavbar />
            </header>
            <main>
                <HorizontalPageSplit resize={Limit}>
                    <aside id="leftPanelBar">
                        <VerticalPageSplit resize={Limit} >
                            <div style={{ minHeight: 150 }}>
                                <ShapesPanel getCreatorOnDragCallback={draggableElemCallback} />
                            </div>
                            <div style={{ minHeight: 150 }}>
                                <PagesPanel currentProject={currentProject} />
                                <LayersPanel currentPage={currentProject.getCurrentPage()} />
                            </div>
                        </VerticalPageSplit>
                    </aside>

                    <section id="workspace">
                        <div className="canvas-container" ref={workspaceDivRef}>
                            <SVGCanvas
                                currentPage={currentProject.getCurrentPage()}
                                canvasConfig={orientation}
                                getCursorCoordsCallback={cursorCoordsCallback}
                                getClickedElemConfigCallback={clickedElemPropsCallback}
                                creatorOnDrop={currentCreator}
                            />
                        </div>
                    </section>

                    <aside id="rightPanelBar">
                        <div className="content">
                            <VerticalPageSplit resize={Limit}>
                                <div style={{ minHeight: 150 }}>
                                    <ObjectPropertiesPanel elemProps={selectedElemProps} />
                                </div>
                                <div style={{ minHeight: 150 }}>
                                    <GraphicalPropertiesPanel elemProps={selectedElemProps} />
                                </div>
                            </VerticalPageSplit>
                        </div>
                    </aside>
                </HorizontalPageSplit>
            </main>
        </div>
    );
}

export default ProjectPage