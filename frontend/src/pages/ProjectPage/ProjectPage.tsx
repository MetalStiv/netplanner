import Frame from 'react-frame-component'
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

import React, { useState, useCallback } from 'react';
import SVGCanvas from './SVGCanvas';
import IShapeCreator from '../../model/IShapeCreator';

export interface IElemProps {
    type: string,
    size: { w: number, h: number },
    coords: { x: number, y: number },
}

export interface IDraggableElemProps {
    type: string,
}

const ProjectPage: React.FC = () => {

    const [workspaceSizes, setWorkspaceSizes] = useState<{ w: number, h: number }>({ w: 1024, h: 512 });
    const [canvasCursorCoords, setCanvasCursorCoords] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
    const [selectedElemProps, setSelectedElemProps] = useState<IElemProps | null>(null);
    const [currentCreator, setCurrentCreator] = useState<IShapeCreator | null>(null);


    const cursorCoordsCallback = useCallback((cursorCoords: { x: number, y: number }) => {
        //setCanvasCursorCoords(cursorCoords);
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

            </header>
            <main>
                <aside id="leftPanelBar">
                    <ResizePanel initialWidth={300} minWidth={150} maxWidth={400}>
                        <ResizeContent className='content'>
                            <VerticalPageSplit resize={Limit} heights={['50%', '50%']}>
                                <div style={{ minHeight: 150 }}>
                                    <ShapesPanel getCreatorOnDragCallback={draggableElemCallback} />
                                </div>
                                <div style={{ minHeight: 150 }}>
                                    <PagesPanel />
                                    <LayersPanel />
                                </div>
                            </VerticalPageSplit>
                        </ResizeContent>
                        <ResizeHandleRight className='divider' />
                    </ResizePanel>
                </aside>

                <section id="workspace">
                    {/* <Frame id='renderer-frame'>
                    </Frame> */}

                    <SVGCanvas width={workspaceSizes.w} height={workspaceSizes.h} getCursorCoordsCallback={cursorCoordsCallback} getClickedElemConfigCallback={clickedElemPropsCallback} creatorOnDrop={currentCreator} />

                </section>
                <aside id="rightPanelBar">
                    <div className="content">
                        <VerticalPageSplit resize={Limit}>
                            <div style={{ minHeight: 150 }}>
                                <ObjectPropertiesPanel elemProps={selectedElemProps} />
                            </div>
                            <div style={{ minHeight: 150 }}>
                                <GraphicalPropertiesPanel elemGraphProps={{ coords: selectedElemProps?.coords, size: selectedElemProps?.size }} />
                            </div>
                        </VerticalPageSplit>
                    </div>
                </aside>
            </main>
        </div>
    );
}

export default ProjectPage