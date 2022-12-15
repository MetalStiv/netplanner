import React, { useEffect, useState } from 'react';
import { useRootStore } from '../../providers/rootProvider';
import { IShapeProps, IShape } from '../../model/IShape';
import { IElemProps, IDraggableElemProps } from '../../pages/ProjectPage/ProjectPage'
import IShapeCreator from '../../model/IShapeCreator';
import Circle, { CircleCreator } from '../../model/primitives/Circle';
import Layer, { ILayer } from '../../model/Layer';
import Page, { IPage } from '../../model/Page';
import ICanvasConfig from '../../common/canvasConfig';

interface SVGCanvasProps {
    currentPage: IPage,
    updatePageCallback: (page: IPage) => void,
    canvasConfig: ICanvasConfig,
    scale: number,
    creatorOnDrop: IShapeCreator | null,
    getCursorCoordsCallback: (cursorCoords: { x: number, y: number }) => void,
    getClickedElemConfigCallback: (elemProps: IElemProps) => void,
}

const SVGCanvas = ({ currentPage, updatePageCallback, canvasConfig, scale, 
    creatorOnDrop, getCursorCoordsCallback, getClickedElemConfigCallback }: SVGCanvasProps) => {

    //let svgChildren = useRootStore()!.getProjectStore().getProjects().at(0)!.renderedShapes!;

    // const [svgChildren, setSVGChildren] = useState<ILayer[]>(
    //     //useRootStore()!.getProjectStore().getProjects().at(0)!.pages?.at(0)!.layers.at(0)!.elems!
    //     useRootStore()!.getProjectStore().getProjects().at(0)!.pages?.at(0)!.getLayers()
    // );

    // useEffect(() => {
    //     return function () {
    //         useRootStore()!.getProjectStore().getProjects().at(0)!.setShapes!(svgChildren);
    //     }
    // }, []);

    //const userStore = useRootStore()?.getUserStore()

    function moveSVGAt(elemID: string, toSVGCoords: { x: number, y: number }, shift?: { x: number, y: number }) {
        currentPage.setLayers(currentPage.getLayers().map(layer => {
            layer.elems = layer.getElems().map(item => {
                if (item.config.id === elemID) {
                    let newData: IShapeProps = JSON.parse(JSON.stringify(item.config));
                    // newData.graphical.startCoords = {
                    //     x: Math.trunc(toSVGCoords.x - (shift ? shift.x : 0)),
                    //     y: Math.trunc(toSVGCoords.y - (shift ? shift.y : 0)),
                    // }
                    newData.graphical.x.value = Math.trunc(toSVGCoords.x - (shift ? shift.x : 0)).toString();
                    newData.graphical.y.value = Math.trunc(toSVGCoords.y - (shift ? shift.y : 0)).toString();
                    item.config = newData;
                    //console.log(item)
                }
                return item;
            })
            return layer;
        }));

        updatePageCallback(currentPage);
    }

    const svgDragNDrop = (e: React.MouseEvent<SVGGeometryElement>) => {
        const cur = e.currentTarget;
        const shift = {
            x: e.clientX - cur.getBoundingClientRect().left, // смещение позиции курсора от позиции элемента по x
            y: e.clientY - cur.getBoundingClientRect().top, // по y
        }
        function onMouseMove(event: MouseEvent) {
            let toCoords = transformOuterCoordsToSVGCoords({ x: event.pageX, y: event.pageY });
            moveSVGAt(cur.id, toCoords, shift);
        }

        cur.parentElement!.onmousemove = onMouseMove;
        cur.parentElement!.onmouseup = () => {
            cur.parentElement!.onmousemove = null;
            cur.parentElement!.onmouseup = null;
        }
    }

    const svgClickHandler = (e: React.MouseEvent<SVGElement>) => {
        const svg = e.currentTarget as SVGSVGElement;
        //const NS = svg.getAttribute('xmlns');
        const pt = svg.createSVGPoint();

        // pass event coordinates
        pt.x = e.clientX;
        pt.y = e.clientY;

        // transform to SVG coordinates
        //const svgP = pt.matrixTransform(svg.getScreenCTM()!.inverse());

        //console.log('SVGclick')
        // svgChildren.push(
        //     new Rect({
        //         id: `rect${genID(10)}`,
        //         startCoords: {
        //             x: svgP.x,
        //             y: svgP.y,
        //         },
        //         sizes: {
        //             w: 15,
        //             h: 10
        //         }
        //     }))
    }

    const transformOuterCoordsToSVGCoords = (coords: { x: number, y: number }) => {
        const svgCanvas = document.querySelector('#canvas svg') as SVGSVGElement;
        //const NS = svgCanvas.getAttribute('xmlns');
        const pt = svgCanvas.createSVGPoint();

        // pass event coordinates
        pt.x = coords.x;
        pt.y = coords.y;

        // трансформация в SVG координаты
        const svgP = pt.matrixTransform(svgCanvas.getScreenCTM()!.inverse());
        svgP.x = Math.trunc(svgP.x);
        svgP.y = Math.trunc(svgP.y);
        //console.log(svgP)
        return svgP;
    }

    const onMousemoveCaptureHandler = (e: React.MouseEvent<SVGElement>) => {
        const SVGCursorCoords = transformOuterCoordsToSVGCoords({ x: e.pageX, y: e.pageY });
        getCursorCoordsCallback(SVGCursorCoords);
    }

    const svgSelect = (e: React.MouseEvent<SVGGeometryElement>) => {
        let curObj: IShape | undefined;
        currentPage.getLayers().some(layer => {
            curObj = layer.getElems().find(item => {
                if (item.config.id === e.currentTarget.id) {
                    return item;
                }
            })
            return typeof (curObj) !== 'undefined' ? true : false;
        });
        const config: IElemProps = {
            type: curObj!.type,
            size: {
                w: Math.round(e.currentTarget.getBBox().width),
                h: Math.round(e.currentTarget.getBBox().height)
            },
            graphProps: curObj!.config.graphical,
            //coords: curObj!.config.graphical.startCoords,
        }
        getClickedElemConfigCallback(config);
    }

    const onDropHandler = (e: React.MouseEvent) => {
        const dropCoords = transformOuterCoordsToSVGCoords({
            x: e.pageX,
            y: e.pageY,
        })
        const newShape: IShape = creatorOnDrop!.create();
        //|| new Circle({ graphical: { startCoords: { x: 0, y: 0 }, r: { label: 'Radius', value: '10' } } });
        newShape.config.graphical.x.value = dropCoords.x.toString();
        newShape.config.graphical.y.value = dropCoords.y.toString();

        currentPage.setLayers(currentPage.getLayers().map(layer => {
            if (layer.isCurrent) {
                layer.addElem(newShape);
            }
            return layer;
        }));
        //currentPage = { ...currentPage }

        updatePageCallback(currentPage);
        //console.log(dropCoords)
    }

    return (
        <div id="canvas" onDrop={onDropHandler} onDragOver={e => e.preventDefault()}
            style={{ width: canvasConfig.canvasWidth*scale, height: canvasConfig.canvasHeight*scale }}>
            <svg
                style={{backgroundColor: canvasConfig.sheetFillColor}}
                viewBox={`0 0 ${canvasConfig.canvasWidth} ${canvasConfig.canvasHeight}`}
                onClick={svgClickHandler}
                onMouseMoveCapture={onMousemoveCaptureHandler}
                xmlns="http://www.w3.org/2000/svg">
                {
                    Array.from(Array(Math.floor(canvasConfig.canvasWidth/canvasConfig.subgridStep*scale)).keys()).map(gridLine => 
                        <path stroke={canvasConfig.subgridColor} 
                            key={'vertical_subgrid_'+gridLine}
                            strokeWidth={1}
                            vectorEffect="non-scaling-stroke"
                            d={
                                `M ${gridLine*canvasConfig.subgridStep/scale} 0 ${gridLine*canvasConfig.subgridStep/scale} ${canvasConfig.canvasHeight}`
                            }
                        />
                    )
                }
                {
                    Array.from(Array(Math.floor(canvasConfig.canvasHeight/canvasConfig.subgridStep*scale)).keys()).map(gridLine => 
                        <path stroke={canvasConfig.subgridColor} 
                            key={'horizontal_subgrid_'+gridLine}
                            strokeWidth={1}
                            vectorEffect="non-scaling-stroke"
                            d={
                                `M 0 ${gridLine*canvasConfig.subgridStep/scale} ${canvasConfig.canvasWidth} ${gridLine*canvasConfig.subgridStep/scale}`
                            }
                        />
                    )
                }
                {
                    Array.from(Array(Math.ceil(canvasConfig.canvasWidth/canvasConfig.gridStep*scale)).keys()).map(gridLine => 
                        <path stroke={canvasConfig.gridColor} 
                            key={'vertical_grid_'+gridLine}
                            strokeWidth={1}
                            vectorEffect="non-scaling-stroke"
                            d={
                                `M ${gridLine*canvasConfig.gridStep/scale} 0 ${gridLine*canvasConfig.gridStep/scale} ${canvasConfig.canvasHeight}`
                            }
                        />
                    )
                }
                {
                    Array.from(Array(Math.ceil(canvasConfig.canvasHeight/canvasConfig.gridStep*scale)).keys()).map(gridLine => 
                        <path stroke={canvasConfig.gridColor} 
                            key={'horizontal_grid_'+gridLine}
                            strokeWidth={1}
                            vectorEffect="non-scaling-stroke"
                            d={
                                `M  0 ${gridLine*canvasConfig.gridStep/scale} ${canvasConfig.canvasWidth} ${gridLine*canvasConfig.gridStep/scale}`
                            }
                        />
                    )
                }
                { 
                    Array.from(Array(canvasConfig.a4Height).keys()).map(sheet => 
                        <path stroke={canvasConfig.sheetStrokeColor}
                            key={'horizontal_sheet_separator_'+sheet}
                            strokeWidth={1}
                            vectorEffect="non-scaling-stroke"
                            d={
                                `M 0 ${sheet*canvasConfig.a4Height} ${canvasConfig.canvasWidth} ${sheet*canvasConfig.a4Height}`
                            }
                        />
                    )
                }
                { 
                    Array.from(Array(canvasConfig.a4Width).keys()).map(sheet => 
                        <path stroke={canvasConfig.sheetStrokeColor} 
                            key={'vertical_sheet_separator_'+sheet}
                            strokeWidth={1}
                            vectorEffect="non-scaling-stroke"
                            d={
                                `M ${sheet*canvasConfig.a4Width} 0 ${sheet*canvasConfig.a4Width} ${canvasConfig.canvasHeight}`
                            }
                        />
                    )
                }
                { currentPage.getLayers().map((layer: ILayer) => layer.getElems().map(el => el.render(svgDragNDrop, svgSelect))) }
            </svg>
        </div>
    )
}

export default SVGCanvas;