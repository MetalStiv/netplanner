import {
    HorizontalPageSplit,
    VerticalPageSplit,
    Limit
} from 'react-page-split';
import 'react-page-split/style.css';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import SVGCanvas from './SVGCanvas';
import IShapeCreator from '../../model/shapes/IShapeCreator';
import HeaderNavbar from './HeaderNavbar';
import { useRootStore } from '../../providers/rootProvider';
import ICanvasConfig, { Portrait } from "../../common/canvasConfig";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LanguageData, useLanguageContext } from '../../providers/languageProvider';
import { TProjectStore } from '../../stores/projectStore';
import { TActionStore } from '../../stores/actionStore';
import { observer } from 'mobx-react-lite';
import blockDiagramGroup from '../../model/shapes/blockDiagramShapes/BlockDiagramGroup';
import primitiveGroup from '../../model/shapes/primitiveShapes/PrimitivesGroup';
import IShape, { IShapeGraphicalProps, IShapeObjectProps } from '../../model/shapes/IShape';
import Project, { IProject } from '../../model/projectData/Project';
import IShapeGroup from '../../model/shapes/IShapeGroup';
import { IAction } from '../../model/actions/IAction';
import { AlertDialog, Loader } from '../../components';
import ShapesPanel from './leftPanelBar/ShapesPanel';
import PagesPanel from './leftPanelBar/PagesPanel';
import LayersPanel from './leftPanelBar/LayersPanel';
import ObjectPropertiesPanel from './rightPanelBar/ObjectPropertiesPanel';
import GraphicalPropertiesPanel from './rightPanelBar/GraphicalPropertiesPanel';
import floorPlanGroup from '../../model/shapes/floorplanShapes/FloorPlanGroup';
import { DeleteShapeAction } from '../../model/actions/DeleteShapeAction';
import { ILayer } from '../../model/projectData/Layer';
import IProjectMeta from '../../model/projectData/IProjectMeta';
import { projectMicroservice, userMicroservice } from '../../common/axiosMicroservices';
import IUser from '../../model/IUser';
import { TUserStore } from '../../stores/userStore';
import { TUsersStore } from '../../stores/usersStore';
import IInvite from '../../model/projectData/IInvite';
import { TProjectsMetaStore } from '../../stores/projectsMetaStore';
import { getUserId } from '../../common/login';
import { updateInfoTime } from '../../common/constants';
import { ShapeType } from '../../model/shapes/ShapeType';
import { AddShapeAction } from '../../model/actions/AddShapeAction';
import ColorEditor from '../../components/Editors/ColorEditor/ColorEditor';
import networkGroup from '../../model/shapes/networkShapes/NetworkGroup';
// import { UndoAction } from '../../model/Action';

export interface IShapeProps {
    id: string,
    type: ShapeType,
    graphProps: IShapeGraphicalProps,
    objectProps: IShapeObjectProps,
    //coords: { x: number, y: number },
}

export interface IDraggableShapeProps {
    type: string,
}

const ProjectPage: React.FC = observer(() => {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const [canvasCursorCoords, setCanvasCursorCoords] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [selectedShapeProps, setSelectedShapeProps] = useState<IShapeProps | null>(null);
    const [currentCreator, setCurrentCreator] = useState<IShapeCreator | null>(null);
    const [orientation,] = useState<ICanvasConfig>(Portrait);
    const [projectUpdateError, setProjectUpdateError] = useState<boolean>(false);
    const workspaceDivRef = useRef<HTMLDivElement>(null);

    const lang: LanguageData | null = useLanguageContext();
    const userStore: TUserStore = useRootStore().getUserStore();
    const usersStore: TUsersStore = useRootStore().getUsersStore();
    const actionStore: TActionStore = useRootStore().getActionStore();
    const projectsMetaStore: TProjectsMetaStore = useRootStore()!.getProjectsMetaStore();
    const projectStore: TProjectStore = useRootStore()!.getProjectStore();
    // const project = projectStore.getProject();

    const updateProject = useCallback(async (projectId: string) => {
        const newProject = new Project([
            primitiveGroup,
            blockDiagramGroup,
            floorPlanGroup,
            networkGroup,
        ] as IShapeGroup[], 'project', projectId)
        projectStore.setProject(newProject);
        projectStore.setProjectToLoadId(projectId);
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
        const onKeyDown = (e: KeyboardEvent) => {
            // if (e.code === 'Delete') {
            //     const currentLayer: ILayer = projectStore.getProject()
            //         ?.getCurrentPage()
            //         .getCurrentLayer()!
            //     const deleteShapeAction = new DeleteShapeAction(currentLayer.getShapes()
            //         .find((s: IShape) => s.config.id === selectedShapeProps!.id)!,
            //         currentLayer?.getID());
            //     actionStore.push(deleteShapeAction);
            // }
            if (e.ctrlKey && e.code === 'KeyZ') {
                actionStore.back();
            }
            if (e.ctrlKey && e.code === 'KeyY') {
                actionStore.forward();
            }
            // if (e.ctrlKey && e.code === 'KeyC') {
            //     const currentLayer: ILayer = projectStore.getProject()
            //         ?.getCurrentPage()
            //         .getCurrentLayer()!
            //     let shapes = selectedShapes.map(ss => currentLayer.getShapes().find(s => s.config.id === ss))
            //         .filter((x): x is IShape => x !== undefined);
            //     shapes = JSON.parse(JSON.stringify(shapes))
            //     shapes.forEach(s => {
            //         s.config.id = undefined
            //         s.config.zIndex = undefined
            //     })
            //     userStore.putToCopyBuffer(shapes)
            // }
            // if (e.ctrlKey && e.code === 'KeyX') {
            //     const currentLayer: ILayer = projectStore.getProject()
            //         ?.getCurrentPage()
            //         .getCurrentLayer()!
            //     userStore.putToCopyBuffer(currentLayer.getShapes()
            //         .filter(s => s.isSelected === true))

            //     const deleteShapeAction = new DeleteShapeAction(currentLayer.getShapes()
            //         .filter((s: IShape) => s.isSelected === true)![0],
            //         currentLayer?.getID());
            //     actionStore.push(deleteShapeAction);
            // }
            // if (e.ctrlKey && e.code === 'KeyV') {
            //     console.log(userStore.getFromCopyBuffer())
            //     const currentLayer: ILayer = projectStore.getProject()
            //         ?.getCurrentPage()
            //         .getCurrentLayer()!
            //     const shapesToAdd = userStore.getFromCopyBuffer();
            //     const addShapeAction = new AddShapeAction(shapesToAdd[0], currentLayer, canvasCursorCoords);
            //     console.log(addShapeAction)
            //     actionStore.push(addShapeAction);
            // }
        }

        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [selectedShapeProps]);

    const getUsers = useCallback(async (projects: IProjectMeta[]) => {
        const userIds: Set<string> = new Set<string>();
        projects.forEach((project: IProjectMeta) => {
            userIds.add(project.ownerId);
            if (project.invites) {
                project.invites.forEach(i => userIds.add(i.userId))
            }
        });
        const users = await userMicroservice.get<IUser[]>('getUsersByIds', { params: { ids: Array.from(userIds) } })
        if (users.status === 200) {
            usersStore?.setData(users.data)
        }
        if (users.status === 401) {
            navigate("/");
        }
    }, [usersStore])

    const getActiveInvites = useCallback(async () => {
        const invites = await projectMicroservice.get<IInvite[]>('getActiveInvites')
        if (invites.status === 200) {
            userStore?.setInvites(invites.data)
        }
        if (invites.status === 401) {
            navigate("/");
        }
    }, [])

    const getProjects = useCallback(async () => {
        projectStore.getProject()?.setIsLoading(true)
        let projects = await projectMicroservice.get<IProjectMeta[]>('getProjects')
        const openMenuId = projectsMetaStore.getData().find(p => p.showMenu === true)?.id ?? "";
        const openShareFormId = projectsMetaStore.getData().find(p => p.showSharingForm === true)?.id ?? "";
        const openMoveFormId = projectsMetaStore.getData().find(p => p.showMoveForm === true)?.id ?? "";

        if (projects.status === 200) {
            const data = projects.data.map((item: IProjectMeta) => ({
                ...item, "hide": false,
                "showMenu": item.id === openMenuId, "showMoveForm": item.id === openMoveFormId,
                "showSharingForm": item.id === openShareFormId
            }));
            await getUsers(data);
            await getActiveInvites();
            projectsMetaStore?.setData(data);
        }
        if (projects.status === 401) {
            navigate("/");
        }
        projectStore.getProject()?.setIsLoading(false)
    }, [projectsMetaStore, getUsers, getActiveInvites])

    const getUserInfo = useCallback(async () => {
        const res = await userMicroservice.get<IUser>("/whois")
        if (res.status === 200) {
            res.data.id = getUserId()
            userStore.setData(res.data)
        }
        if (res.status === 401) {
            navigate("/");
        }
    }, [])

    const update = useCallback(() => {
        getUserInfo();
        getProjects();
    }, [getUserInfo, getProjects])

    useEffect(() => {
        update()
    }, [])

    useEffect(() => {
        const interval = setInterval(() => {
            getUsers(projectsMetaStore.getData())
        }, updateInfoTime)
        return () => clearInterval(interval)
    }, [update])

    return (
        <div id="projectPage">
            {
                (!projectStore.getProject() || projectStore.getProject()!.isLoading()) && <Loader />
            }
            <AlertDialog
                btnText="Ok"
                text={lang!.langText.projectPage.notAllowed}
                isShown={projectUpdateError}
                onClose={() => navigate('/home')}
            />
            <header>
                <HeaderNavbar update={update} />
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
                                    (projectStore.getProject() && !projectStore.getProject()!.isLoading()) && <>
                                        <PagesPanel />
                                        <LayersPanel />
                                    </>
                                }
                            </div>
                        </VerticalPageSplit>
                    </aside>

                    <section id="workspace">
                        <div className="canvas-container" ref={workspaceDivRef}>
                            {
                                (projectStore.getProject() && !projectStore.getProject()!.isLoading()) &&
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
                        {/* <div className="content"> */}
                        <VerticalPageSplit resize={Limit}>
                            <div style={{ minHeight: 150 }}>
                                <ObjectPropertiesPanel shapeProps={selectedShapeProps} 
                                    onChange={(props) => setSelectedShapeProps({ ...selectedShapeProps!, objectProps: props })} />
                            </div>
                            <div style={{ minHeight: 150 }}>
                                <GraphicalPropertiesPanel
                                    canvasProps={orientation}
                                    shapeProps={selectedShapeProps}
                                    onChange={(props) => setSelectedShapeProps({ ...selectedShapeProps!, graphProps: props })}
                                />
                            </div>
                        </VerticalPageSplit>
                        {/* </div> */}
                    </aside>
                </HorizontalPageSplit>
            </main>
        </div>
    );
})

export default ProjectPage