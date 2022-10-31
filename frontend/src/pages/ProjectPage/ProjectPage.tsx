import Frame from 'react-frame-component'
//import { Container, Section, Bar } from "react-simple-resizer";
import {
    ResizeContent,
    ResizeHandleLeft,
    ResizeHandleRight,
    ResizePanel,
} from "react-hook-resize-panel";
import ShapesPanel from '../../components/ShapesPanel';
// import Circle from '../../model/shapes/Circle';
// import Line from '../../model/shapes/Line';
// import Polyline from '../../model/shapes/Polyline';
// import Point from '../../model/shapes/Point';

import '../../styles/project.scss';

import { Panel } from './Panel';
// import Ellipse from '../../model/shapes/Ellipse';
// import Rect from '../../model/shapes/Rect';
import React, { MouseEventHandler, ReactNode, ReactSVGElement, useEffect, useId, useRef, useState } from 'react';
import SVGCanvas from '../../components/SVGCanvas';
import IShape from '../../model/shapes/IShape';
import SVGElemsCreator from '../../model/shapes/SVGElemsCreator';
import Shapes from '../../model/shapes/Shapes';
import { generateKey } from 'crypto';

const ProjectPage: React.FC = () => {


    //let [cursorSVGPos, setCursorSVGPos] = useState<{ x: number, y: number }>({ x: 0, y: 0 })
    const [draggableElem, setdraggableElem] = useState<SVGGeometryElement | null>(null);
    const [text, setText] = useState('a');


    function getSVGCoords(el: SVGGeometryElement) {
        var parentRect = el.parentElement!.getBoundingClientRect();
        var elRect = el.getBoundingClientRect();

        return {
            x: elRect.left - parentRect.left,
            y: elRect.top - parentRect.top,
        };
    }


    function moveSVGAt(cursorCoords: { x: number, y: number }) {
        if (draggableElem === null) {
            return;
        }
        var currentSVGCoords = getSVGCoords(draggableElem!); // свг-координаты текущего положения элемента

        let cursorSVGPos = transformCursorCoordsToSVGCoords(draggableElem!.parentElement as any as SVGElement, { x: cursorCoords.x, y: cursorCoords.y });

        // const svgCanvas = e.currentTarget.parentElement;
        const shift = {
            x: cursorSVGPos.x - currentSVGCoords.x, // смещение позиции курсора от позиции элемента по x
            y: cursorSVGPos.y - currentSVGCoords.y, // по y
        }
        console.log(cursorSVGPos, currentSVGCoords, shift)

        //let svgChildrenMutable = Object.assign([], svgChildren);
        svgChildren.filter((el: SVGElemsCreator) => {
            if (el.initObj.id === draggableElem.id) {
                let newEl = JSON.parse(JSON.stringify(el));
                newEl.initObj.coord = {
                    x: cursorSVGPos.x - shift.x,
                    y: cursorSVGPos.y - shift.y
                }
                console.log('new', newEl)
                return newEl;
            }
            return el;
        });
        console.log(svgChildren)
        //setSVGChildren(svgChildrenMutable as Array<SVGElemsCreator>);
        // const dragObj = svgChildrenMutable.find((el, i) => el.initObj.id === draggableElem.id); // находим объект в текущем массиве объектов элементов
        // console.log(dragObj)
        // dragObj!.initObj.coord.x = cursorSVGPos.x - shift.x;
        // dragObj!.initObj.coord.y = cursorSVGPos.y - shift.y;

        // draggableElem.setAttribute('x', `${cursorSVGPos.x - shift.x}`);
        // draggableElem.setAttribute('y', `${cursorSVGPos.y - shift.y}`);
        //console.log(draggableElem.getAttribute('x'), draggableElem.getAttribute('y'))
    }


    const svgDragNDrop = (e: React.SyntheticEvent<SVGGeometryElement, MouseEvent>) => {
        const dragElem = e.currentTarget;
        setdraggableElem(dragElem);
        console.log(dragElem)
        //console.log('c', transformCursorCoordsToSVGCoords(e, cursorPos))

        // console.log(currentSVGCoords.x, currentSVGCoords.y)
        // console.log(cursorPos.x)
        // console.log((cursorPos.x - svgCanvas!.getBoundingClientRect().x), (cursorPos.y - svgCanvas!.getBoundingClientRect().y))
        // console.log(shift.x, shift.y)
        // console.log(cursorPos.x - svgCanvas!.getBoundingClientRect().x + shift.x, cursorPos.y - svgCanvas!.getBoundingClientRect().y + shift.y)


        //let imageSVG = e.currentTarget;
        //imageSVG.style.position = 'absolute';
        //imageSVG.style.zIndex = '1000';
        //document.body.appendChild(imageSVG);
        //e.currentTarget.style.opacity = '0';

        //ball.style.position = 'absolute';
        //document.body.appendChild(ball);
        // moveAt(e);

        // ball.style.zIndex = 1000; // над другими элементами




        // e.currentTarget.parentElement!.onmousemove = function (e:React.SyntheticEvent<SVGElement, MouseEvent>) {
        //      moveAt(getSVGCoords(e.currentTarget));
        // };

        // ball.onmouseup = function () {
        //     document.onmousemove = null;
        //     ball.onmouseup = null;
        // };
    }

    const genID = (len: number) => {
        return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(len).toString().replace('.', ''));
    }

    //const [svgChildren, setSVGChildren] = useState<Array<SVGElemsCreator>>(
    let svgChildren =
        [
            new SVGElemsCreator(Shapes.Rect, {
                id: `rect${genID(10)}`,
                coord: {
                    x: 250,
                    y: 250,
                },
                sizes: {
                    w: 15,
                    h: 10
                }
            }),
            new SVGElemsCreator(Shapes.Circle, {
                id: `circle${genID(10)}`,
                coord: {
                    x: 200,
                    y: 200,
                },
                r: 10,
                stroke: 'red',
                fill: 'blue',
                sizes: {
                    w: 15,
                    h: 10
                }
            }),

            // new SVGElemsCreator(Shapes.Line, {
            //     id: `line${genID(10)}`,
            //     startCoord: {
            //         x1: 15,
            //         y1: 35,
            //     },
            //     endCoord: {
            //         x2: 253,
            //         y2: 150
            //     }
            // }),

            // new SVGElemsCreator(Shapes.Polyline, {
            //     id: `polyline${genID(10)}`,
            //     points: [[2, 3], [15, 80], [120, 65], [50, 16], [250, 250]],
            //     stroke: 'green'
            // }),

            new SVGElemsCreator(Shapes.Point, {
                id: `point${genID(10)}`,
                coord: {
                    x: 274,
                    y: 183
                },
                r: 1
            }),

            new SVGElemsCreator(Shapes.Ellipse, {
                id: `ellipse${genID(10)}`,
                coord: {
                    x: 174,
                    y: 123
                },
                rDif: {
                    rx: 50,
                    ry: 25,
                },
                fill: 'yellow'
            }),
        ];


    const svgClickHandler = (e: React.MouseEvent<SVGElement>) => {
        const svg = e.currentTarget as SVGSVGElement;
        const NS = svg.getAttribute('xmlns');
        const pt = svg.createSVGPoint();

        // pass event coordinates
        pt.x = e.clientX;
        pt.y = e.clientY;

        // transform to SVG coordinates
        const svgP = pt.matrixTransform(svg.getScreenCTM()!.inverse());

        // add new SVG element
        // const circle = document.createElementNS(NS, 'circle');
        // circle.setAttribute('cx', svgP.x);
        // circle.setAttribute('cy', svgP.y);
        // circle.setAttribute('r', '10');

        //setSVGChildren([...svgChildren,
        svgChildren.push(
            new SVGElemsCreator(Shapes.Rect, {
                id: `rect${genID(10)}`,
                coord: {
                    x: svgP.x,
                    y: svgP.y,
                },
                sizes: {
                    w: 15,
                    h: 10
                }
            }))

        //     Rect.render({
        //     x: svgP.x,
        //     y: svgP.y,
        //     width: 15,
        //     height: 10
        // }, svgDragNDrop, () => setdraggableElem(null)) as any as SVGGeometryElement]);

    }

    const transformCursorCoordsToSVGCoords = (svg: SVGElement, coords: { x: number, y: number }) => {
        const svgCanvas = svg as SVGSVGElement;
        const NS = svgCanvas.getAttribute('xmlns');
        const pt = svgCanvas.createSVGPoint();

        // pass event coordinates
        pt.x = coords.x;
        pt.y = coords.y;

        // transform to SVG coordinates
        const svgP = pt.matrixTransform(svgCanvas.getScreenCTM()!.inverse());
        //console.log('trans', svgP)
        return svgP;
    }

    const canvasMouseMoveHandler = (e: React.MouseEvent<SVGElement>) => {
        if (draggableElem) {
            const x = e.pageX;
            const y = e.pageY;
            moveSVGAt({ x, y })
        }

    }

    return (
        <div id="projectPage">
            <header>

            </header>
            <main>
                <aside id="leftPanelBar">
                    <ResizePanel initialWidth={300} minWidth={150} maxWidth={400}>
                        <ResizeContent className='content'>
                            <ShapesPanel />
                            <Panel />
                        </ResizeContent>
                        <ResizeHandleRight className='divider' />
                    </ResizePanel>
                </aside>

                <section id="workspace">
                    {/* <Frame id='renderer-frame'>

                    </Frame> */}

                    <SVGCanvas width={500} height={300} objects={svgChildren} onMouseMoveHandler={canvasMouseMoveHandler} onMouseDownHandler={svgDragNDrop} onMouseUpHandler={(e) => setdraggableElem(null)} />
                    {/* onMouseMoveHandler={e => setCursorSVGPos(transformCursorCoordsToSVGCoords(e.currentTarget, { x: e.pageX, y: e.pageY }))} */}

                    <p style={{ textAlign: 'center' }}>{text}</p>

                </section>
                <aside id="rightPanelBar">
                    <ResizePanel initialWidth={300} minWidth={150} maxWidth={400}>
                        <ResizeHandleLeft className='divider' />
                        <ResizeContent className='content' >
                            <Panel />
                        </ResizeContent>
                    </ResizePanel>
                </aside>
            </main>
        </div>
    );
}

export default ProjectPage