import React, { useState } from 'react';
//import { useRootStore } from '../providers/rootProvider';
import Circle from '../../model/shapes/Circle';
import Line from '../../model/shapes/Line';
import Polyline from '../../model/shapes/Polyline';
import Point from '../../model/shapes/Point';
import Ellipse from '../../model/shapes/Ellipse';
import Rect from '../../model/shapes/Rect';
import { IShapeProps, IShape } from '../../model/shapes/IShape';
import { IElemProps } from '../../pages/ProjectPage/ProjectPage'

interface SVGCanvasProps {
    width: number,
    height: number,
    getCursorCoordsCallback: (cursorCoords: { x: number, y: number }) => void,
    getClickedElemPropsCallback: (elemProps: IElemProps) => void,
    //objects: Array<IShape>,
    //onClickHandler?: (e: React.MouseEvent<SVGElement>) => void,
    //onMouseDownHandler: (e: React.MouseEvent<SVGGeometryElement>) => void,
}

const SVGCanvas = ({ width, height, getCursorCoordsCallback, getClickedElemPropsCallback }: SVGCanvasProps) => {
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
            if (item.elemProps.id === elemID) {
                let newData: IShapeProps = JSON.parse(JSON.stringify(item.elemProps));
                newData.startCoords = {
                    x: Math.trunc(toSVGCoords.x - (shift ? shift.x : 0)),
                    y: Math.trunc(toSVGCoords.y - (shift ? shift.y : 0)),
                }
                item.elemProps = newData;
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

    const genID = (len: number) => {
        return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(len).toString().replace('.', ''));
    }

    const [svgChildren, setSVGChildren] = useState<Array<IShape>>(
        [
            new Rect({
                id: `rect-${genID(10)}`,
                startCoords: {
                    x: 250,
                    y: 250,
                },
                sizes: {
                    w: 15,
                    h: 10
                }
            }),
            new Circle({
                id: `circle-${genID(10)}`,
                startCoords: {
                    x: 200,
                    y: 200,
                },
                r: 10,
                stroke: 'red',
                fill: 'blue',
            }),
            new Line({
                id: `line-${genID(10)}`,
                startCoords: {
                    x: 15,
                    y: 35,
                },
                endCoords: {
                    x: 253,
                    y: 150
                }
            }),

            new Polyline({
                id: `polyline${genID(10)}`,
                startCoords: {
                    x: 2,
                    y: 3,
                },
                points: [[15, 80], [120, 65], [50, 16], [25, 25]],
                stroke: 'green'
            }),

            new Point({
                id: `point-${genID(10)}`,
                startCoords: {
                    x: 274,
                    y: 183
                },
                r: 1
            }),

            new Ellipse({
                id: `ellipse-${genID(10)}`,
                startCoords: {
                    x: 174,
                    y: 123
                },
                rDif: {
                    rx: 150,
                    ry: 25,
                },
                fill: 'yellow'
            }),
        ]);


    const svgClickHandler = (e: React.MouseEvent<SVGElement>) => {
        const svg = e.currentTarget as SVGSVGElement;
        const NS = svg.getAttribute('xmlns');
        const pt = svg.createSVGPoint();

        // pass event coordinates
        pt.x = e.clientX;
        pt.y = e.clientY;

        // transform to SVG coordinates
        const svgP = pt.matrixTransform(svg.getScreenCTM()!.inverse());

        console.log('SVGclick')
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
        console.log(svgP)
        return svgP;
    }

    const onMousemoveCaptureHandler = (e: React.MouseEvent<SVGElement>) => {
        const SVGCursorCoords = transformOuterCoordsToSVGCoords({ x: e.pageX, y: e.pageY });
        getCursorCoordsCallback(SVGCursorCoords);
    }

    const svgSelect = (e: React.MouseEvent<SVGGeometryElement>) => {
        const curObj = svgChildren.find(item => {
            if (item.elemProps.id === e.currentTarget.id) {
                return item;
            }
        });
        const elemProps: IElemProps = {
            type: curObj!.elemProps.type!,
            size: { w: Math.round(e.currentTarget.getBBox().width), h: Math.round(e.currentTarget.getBBox().height) },
            coords: curObj!.elemProps.startCoords,
        }
        getClickedElemPropsCallback(elemProps);
    }

    return (
        <div id="canvas" style={{ width: width, height: height }}>
            <svg viewBox={`0 0 ${width} ${height}`} onClick={svgClickHandler} onMouseMoveCapture={onMousemoveCaptureHandler} xmlns="http://www.w3.org/2000/svg">
                {svgChildren.map((el: IShape) => el.render(svgDragNDrop, svgSelect))}
            </svg>
        </div>
    )
}

export default SVGCanvas;