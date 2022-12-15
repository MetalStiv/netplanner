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

import ShapesPanel from './ShapesPanel';
import PagesPanel from './PagesPanel';
import LayersPanel from './LayersPanel';
import ObjectPropertiesPanel from './ObjectPropertiesPanel';
import GraphicalPropertiesPanel from './GraphicalPropertiesPanel';

import '../../styles/project.scss';

//import { Panel } from './Panel';

import React, { useState, useCallback, useReducer, useRef, useEffect } from 'react';
import SVGCanvas from './SVGCanvas';
import IShapeCreator from '../../model/IShapeCreator';
import HeaderNavbar from './HeaderNavbar';
import { useRootStore } from '../../providers/rootProvider';
import { IPage } from '../../model/Page';
import Project, { IProject } from '../../model/Project';
import { IShapeGraphicalProps } from '../../model/IShape';
import ICanvasConfig, { Portrait } from "../../common/canvasConfig";

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
    const [canvasCursorCoords, setCanvasCursorCoords] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [selectedElemProps, setSelectedElemProps] = useState<IElemProps | null>(null);
    const [currentCreator, setCurrentCreator] = useState<IShapeCreator | null>(null);
    const [project, setProject] = useState<IProject>(
        useRootStore()!.getProjectStore().getProjects().at(0)!
    );
    const [scale, setScale] = useState<number>(1.0);
    const [orientation, setOrientation] = useState<ICanvasConfig>(Portrait);

    const workspaceDivRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        workspaceDivRef.current!.scrollTop = orientation.a4Height*Math.floor(orientation.heightInSheets/2)-150;
        workspaceDivRef.current!.scrollLeft = orientation.a4Width*Math.floor(orientation.widthInSheets/2)-150;
    }, [orientation])

    // function projectReducer(state:IProject, action:IProject) {
    //     switch (action.type) {
    //       case 'updatePages':
    //         //return {count: state.count + 1};
    //       case 'updateLayer':
    //         // return {count: state.count - 1};
    //       default:
    //         return state
    //    }
    // }

    // const [project, projectDispatch] = useReducer(
    //     projectReducer,
    //     useRootStore()!.getProjectStore().getProjects().at(0)!
    // )

    const pageObjCallback = useCallback((page: IPage) => {
        let newProject: IProject = new Project(0, [], []);
        newProject.copy(project);
        newProject.setPages(newProject.getPages().map(pageItem => {
            if (pageItem.id === page.id) {
                pageItem = page;
            }
            return pageItem;
        }))
        setProject(newProject);
    }, []);

    const pagesArrCallback = useCallback((pages: IPage[]) => {
        project.setPages(pages);
        setProject(project);
    }, []);

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
                                    <PagesPanel currentProject={project} updateProjectCallback={pagesArrCallback} />
                                    <LayersPanel currentPage={project.getCurrentPage()} updatePageCallback={pageObjCallback} />
                                </div>
                            </VerticalPageSplit>
                        </ResizeContent>
                        <ResizeHandleRight className='divider' />
                    </ResizePanel>
                </aside>

                <section id="workspace">
                    <div style={{width: 1347, height: 910, marginLeft: 250, overflow: "scroll"}} ref={workspaceDivRef}>
                        <SVGCanvas
                            currentPage={project.getCurrentPage()}
                            updatePageCallback={pageObjCallback}
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

                <div style={{
                        position: 'fixed',  
                        top: '95%',
                        left:'82%'
                    }}>
                    <button onClick={() => setScale(scale => scale > 0.1 ? scale-0.1 : scale)}>-</button>
                    <button onClick={() => setScale(scale => scale+0.1)}>+</button>
                </div>
            </main>
        </div>
    );
}

export default ProjectPage