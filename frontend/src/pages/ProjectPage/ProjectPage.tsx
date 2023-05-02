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
import React, { useState, useCallback, useRef, useEffect } from 'react';
import SVGCanvas from './SVGCanvas';
import IShapeCreator from '../../model/IShapeCreator';
import HeaderNavbar from './HeaderNavbar';
import { useRootStore } from '../../providers/rootProvider';
import Project, { IProject } from '../../model/Project';
import { IShapeGraphicalProps } from '../../model/IShape';
import ICanvasConfig, { Portrait } from "../../common/canvasConfig";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LanguageData, useLanguageContext } from '../../providers/languageProvider';
import PolygonsGroup from '../../model/shapes/PolygonsGroup';
import { CircleCreator } from '../../model/shapes/Circle';
import { EllipseCreator } from '../../model/shapes/Ellipse';
import { RectCreator } from '../../model/shapes/Rect';
import PrimitivesGroup from '../../model/shapes/PrimitivesGroup';
import { LineCreator } from '../../model/shapes/Line';
import { PolylineCreator } from '../../model/shapes/Polyline';
import { PointCreator } from '../../model/shapes/Point';
import IGeometryGroup from '../../model/IGeometryGroup';
import { TProjectStore } from '../../stores/projectStore';
import { TActionStore } from '../../stores/actionStore';
import IAction from '../../model/Action';
import { observer } from 'mobx-react-lite';
import { AlertDialog } from '../../components';
import { Loader } from '../../components';
// import { UndoAction } from '../../model/Action';

export interface IShapeProps {
    type: string,
    graphProps: IShapeGraphicalProps,
    //coords: { x: number, y: number },
}

export interface IDraggableShapeProps {
    type: string,
}

const ProjectPage: React.FC = observer(() => {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const [, setCanvasCursorCoords] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [selectedShapeProps, setSelectedShapeProps] = useState<IShapeProps | null>(null);
    const [currentCreator, setCurrentCreator] = useState<IShapeCreator | null>(null);
    const [orientation,] = useState<ICanvasConfig>(Portrait);
    const [projectUpdateError, setProjectUpdateError] = useState<boolean>(false);
    const workspaceDivRef = useRef<HTMLDivElement>(null);

    const lang: LanguageData | null = useLanguageContext();
    const actionStore: TActionStore = useRootStore().getActionStore();
    const projectStore: TProjectStore = useRootStore()!.getProjectStore();
    const project = projectStore.getProject();

    const [currentProject, setCurrentProject] = useState<IProject | null>(projectStore.getProject());


    const updateProject = useCallback(async (projectId: string) => {
        const newProject = new Project([
            new PolygonsGroup([
                new CircleCreator(),
                new EllipseCreator(),
                new RectCreator(),
            ]),
            new PrimitivesGroup([
                new LineCreator(),
                new PolylineCreator(),
                new PointCreator(),
            ])
        ] as IGeometryGroup[], 'project', projectId)
        projectStore.setProject(newProject);
        projectStore.setProjectToLoadId(projectId);
        // console.log(newProject)
    }, [setProjectUpdateError])

    useEffect(() => {
        workspaceDivRef.current!.scrollTop = orientation.a4Height * Math.floor(orientation.heightInSheets / 2) - 150;
        workspaceDivRef.current!.scrollLeft = orientation.a4Width * Math.floor(orientation.widthInSheets / 2) - 150;
    }, [orientation, workspaceDivRef]);
    
    useEffect(() => {
        const projectId: string = params.get('id') ?? ''
        updateProject(projectId);
    }, []);

    const cursorCoordsCallback = useCallback((cursorCoords: { x: number, y: number }) => {
        setCanvasCursorCoords(cursorCoords);
    }, []);

    const draggableShapeCallback = useCallback((creator: IShapeCreator) => {
        setCurrentCreator(creator);
    }, []);

    const clickedShapePropsCallback = useCallback((shapeProps: IShapeProps) => {
        setSelectedShapeProps(shapeProps);
    }, []);

    useEffect(() => {
        const onKeypress = (e: KeyboardEvent) => {
            console.log(e);
            if (e.ctrlKey && e.code === 'KeyZ') {
                // app?.addAction(new UndoAction(app.actionsHistory));
                const message: IAction | null = actionStore.pop();
                console.log(message);
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
                (!projectStore.getProject() || projectStore.getProject()!.isLoading) && <Loader />
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
                                <ShapesPanel getCreatorOnDragCallback={draggableShapeCallback} />
                            </div>
                            <div style={{ minHeight: 150 }}>
                                {
                                    (projectStore.getProject() && !projectStore.getProject()!.isLoading) && <>
                                        <PagesPanel currentProject={projectStore.getProject()!} />
                                        <LayersPanel currentPage={projectStore.getProject()!.getCurrentPage()} />
                                    </>
                                }
                            </div>
                        </VerticalPageSplit>
                    </aside>

                    <section id="workspace">
                        <div className="canvas-container" ref={workspaceDivRef}>
                            {
                                (projectStore.getProject() && !projectStore.getProject()!.isLoading) &&
                                <SVGCanvas
                                    // currentPage={projectStore.getProject()!.getCurrentPage()}
                                    canvasConfig={orientation}
                                    getCursorCoordsCallback={cursorCoordsCallback}
                                    getClickedShapeConfigCallback={clickedShapePropsCallback}
                                    creatorOnDrop={currentCreator}
                                />
                            }
                        </div>
                    </section>

                    <aside id="rightPanelBar">
                        <div className="content">
                            <VerticalPageSplit resize={Limit}>
                                <div style={{ minHeight: 150 }}>
                                    <ObjectPropertiesPanel shapeProps={selectedShapeProps} />
                                </div>
                                <div style={{ minHeight: 150 }}>
                                    <GraphicalPropertiesPanel shapeProps={selectedShapeProps}
                                    // onChange={val => {
                                    // let changePropAction = new ChangeShapePropertyAction(shapeProps.graphProps, item.label, item.value, val)
                                    // changePropAction.do() && app?.addAction(changePropAction);
                                    // }}
                                    />
                                </div>
                            </VerticalPageSplit>
                        </div>
                    </aside>
                </HorizontalPageSplit>
            </main>
        </div>
    );
})

export default ProjectPage