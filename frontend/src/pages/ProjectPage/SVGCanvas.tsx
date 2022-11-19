import React, { useEffect, useState } from 'react';
import { useRootStore } from '../../providers/rootProvider';
import { IShapeProps, IShape } from '../../model/IShape';
import { IElemProps, IDraggableElemProps } from '../../pages/ProjectPage/ProjectPage'
import IShapeCreator from '../../model/IShapeCreator';
import Circle, { CircleCreator } from '../../model/primitives/Circle';

interface SVGCanvasProps {
    width: number,
    height: number,
    creatorOnDrop: IShapeCreator | null,
    getCursorCoordsCallback: (cursorCoords: { x: number, y: number }) => void,
    getClickedElemConfigCallback: (elemProps: IElemProps) => void,

    //getDraggableElemConfigCallback: (elemProps: IDraggableElemProps) => void,
    //objects: Array<IShape>,
    //onClickHandler?: (e: React.MouseEvent<SVGElement>) => void,
    //onMouseDownHandler: (e: React.MouseEvent<SVGGeometryElement>) => void,
}

const SVGCanvas = ({ width, height, creatorOnDrop, getCursorCoordsCallback, getClickedElemConfigCallback }: SVGCanvasProps) => {

    //let svgChildren = useRootStore()!.getProjectStore().getProjects().at(0)!.renderedShapes!;
    const [svgChildren, setSVGChildren] = useState<Array<IShape>>(
        useRootStore()!.getProjectStore().getProjects().at(0)!.renderedShapes!
    );
    // useEffect(() => {
    //     return function () {
    //         useRootStore()!.getProjectStore().getProjects().at(0)!.setShapes!(svgChildren);
    //     }
    // }, []);

    //const userStore = useRootStore()?.getUserStore()

    // function getSVGCoords(el: { x: number, y: number }) {
    //     var parentRect = document.getElementById('canvas')?.getBoundingClientRect();

    //     return transformOuterCoordsToSVGCoords(
    //         {
    //             x: el.x - parentRect!.left,
    //             y: el.y - parentRect!.top
    //         }
    //     )
    // }


    function moveSVGAt(elemID: string, toSVGCoords: { x: number, y: number }, shift?: { x: number, y: number }) {
        setSVGChildren(svgChildren.map(item => {
            if (item.config.id === elemID) {
                let newData: IShapeProps = JSON.parse(JSON.stringify(item.config));
                newData.graphical.startCoords = {
                    x: Math.trunc(toSVGCoords.x - (shift ? shift.x : 0)),
                    y: Math.trunc(toSVGCoords.y - (shift ? shift.y : 0)),
                }
                item.config = newData;
                return item;
            } else {
                return item;
            }
        }))
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
        const curObj = svgChildren.find(item => {
            if (item.config.id === e.currentTarget.id) {
                return item;
            }
        });
        const config: IElemProps = {
            type: curObj!.type,
            size: { 
                w: Math.round(e.currentTarget.getBBox().width),
                h: Math.round(e.currentTarget.getBBox().height)
            },
            coords: curObj!.config.graphical.startCoords,
        }
        getClickedElemConfigCallback(config);
    }

    const onDropHandler = (e: React.MouseEvent) => {
        const dropCoords = transformOuterCoordsToSVGCoords({
            x: e.pageX,
            y: e.pageY,
        })
        const newShape = creatorOnDrop?.create() 
            || new Circle({ graphical: { startCoords: { x: 0, y: 0 }, r: 10 } });
        newShape.config.graphical.startCoords = dropCoords;

        setSVGChildren([...svgChildren, newShape]);
        //console.log(dropCoords)
    }

    return (
        <div id="canvas" onDrop={onDropHandler} onDragOver={e => e.preventDefault()} 
            style={{ width: width, height: height }}>
            <svg 
                viewBox={`0 0 ${width} ${height}`} 
                onClick={svgClickHandler} 
                onMouseMoveCapture={onMousemoveCaptureHandler} 
                xmlns="http://www.w3.org/2000/svg">
                {svgChildren.map((el: IShape) => el.render(svgDragNDrop, svgSelect))}
            </svg>
        </div>
    )
}

export default SVGCanvas;