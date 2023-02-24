import {
    ResizeContent,
    //ResizeHandleLeft,
    ResizeHandleRight,
    ResizePanel,
} from "react-hook-resize-panel";
import {
    //HorizontalPageSplit,
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
import Page from '../../model/Page';
import Project, { IProject } from '../../model/Project';
import { IShapeGraphicalProps } from '../../model/IShape';
import ICanvasConfig, { Portrait } from "../../common/canvasConfig";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import AlertDialog from "../../components/AlertDialog";
import { projectMicroservice } from "../../common/axiosMicroservices";
import Loader from "../../components/Loader";

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
    const [scale, setScale] = useState<number>(1);
    const [orientation,] = useState<ICanvasConfig>(Portrait);
    const [loading, setLoading] = useState<boolean>(false);
    const [projectUpdateError, setProjectUpdateError] = useState<boolean>(false);

    const workspaceDivRef = useRef<HTMLDivElement>(null);

    const updateProject = useCallback(async () => {
        setLoading(true)
        await new Promise(r => setTimeout(r, 2000));
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
    }, [currentProject, setCurrentProject]);
    // useEffect(() => {
    //     updateProject()
    // }, [updateProject])

    const cursorCoordsCallback = useCallback((cursorCoords: { x: number, y: number }) => {
        setCanvasCursorCoords(cursorCoords);
    }, []);

    const draggableElemCallback = useCallback((creator: IShapeCreator) => {
        setCurrentCreator(creator);
    }, []);

    const clickedElemPropsCallback = useCallback((elemProps: IElemProps) => {
        setSelectedElemProps(elemProps);
    }, []);

    return (
        <div id="projectPage">
            {
                loading && <Loader />
            }
            <AlertDialog
                btnText="Ok"
                text={`You are not allowed to project!`}
                isShown={projectUpdateError}
                onClose={() => navigate('/home')}
            />
            <header>
                <HeaderNavbar />
            </header>
            <main>
                <aside id="leftPanelBar">
                    <ResizePanel initialWidth={250} minWidth={150} maxWidth={400} >
                        <ResizeContent className='content'>
                            <VerticalPageSplit resize={Limit} heights={['50%', '50%']}>
                                <div style={{ minHeight: 150 }}>
                                    <ShapesPanel getCreatorOnDragCallback={draggableElemCallback} />
                                </div>
                                <div style={{ minHeight: 150 }}>
                                    {/* <PagesPanel currentProject={currentProject} updateProjectCallback={pagesArrCallback} />
                                    <LayersPanel currentPage={currentProject.getCurrentPage()} updatePageCallback={pageObjCallback} /> */}
                                    <PagesPanel currentProject={currentProject} />
                                    <LayersPanel currentPage={currentProject.getCurrentPage()} />
                                </div>
                            </VerticalPageSplit>
                        </ResizeContent>
                        <ResizeHandleRight className='divider' />
                    </ResizePanel>
                </aside>

                <section id="workspace">
                    <div className="canvas-container" ref={workspaceDivRef}>
                        <SVGCanvas
                            currentPage={currentProject.getCurrentPage()}
                            //updatePageCallback={pageObjCallback}
                            canvasConfig={orientation}
                            scale={scale}
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

                <div id="scale-slider">
                    <input type="range"
                        min={10}
                        max={200}
                        step={10}
                        value={Math.ceil(scale * 100)}
                        onChange={e => setScale(parseFloat((parseInt(e.target.value) * 0.01).toFixed(1)))}
                    />
                </div>
            </main>
        </div>
    );
}

export default ProjectPage