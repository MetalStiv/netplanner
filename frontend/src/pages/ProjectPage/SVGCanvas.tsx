import React, { useEffect, useState, useRef, ReactHTMLElement } from 'react';
import { IShapeProps } from '../../pages/ProjectPage/ProjectPage'
import IShapeCreator from '../../model/shapes/IShapeCreator';
import ICanvasConfig from '../../common/canvasConfig';
import { ChangeShapePropertyAction } from '../../model/actions/ChangeShapePropertyAction';
import { useRootStore } from '../../providers/rootProvider';
import { TActionStore } from '../../stores/actionStore';
import { observer } from 'mobx-react-lite';
import { RangeInput } from '../../components';
import { useSprings, animated } from '@react-spring/web'
import Page from '../../model/projectData/Page';
import IShape, { IShapeGraphicalProps } from '../../model/shapes/IShape';
import { AddShapeAction } from '../../model/actions/AddShapeAction';
import { ILayer } from '../../model/projectData/Layer';
import { TProjectStore } from '../../stores/projectStore';
import { CursorPositionAction } from '../../model/actions/CursorPositionAction';
import { cursorUpdateTime } from '../../common/constants';
import { TUsersStore } from '../../stores/usersStore';
import { TUserStore } from '../../stores/userStore';
import UserCursor from '../../model/projectData/UserCursor';

interface SVGCanvasProps {
    // currentPage: Page,
    //updatePageCallback: (page: Page) => void,
    canvasConfig: ICanvasConfig,
    //scale: number,
    creatorOnDrop: IShapeCreator | null,
    getCursorCoordsCallback: (cursorCoords: { x: number, y: number }) => void,
    getClickedShapeConfigCallback: (shapeProps: IShapeProps) => void,
    //onWheelHandler: (e: React.WheelEvent<SVGSVGElement>) => void,
}

const SVGCanvas: React.FC<SVGCanvasProps> = observer(({ canvasConfig,
    creatorOnDrop, getCursorCoordsCallback, getClickedShapeConfigCallback }: SVGCanvasProps) => {
    const [scale, setScale] = useState<number>(1);
    const [translate, setTranslate] = useState(
        { x: -canvasConfig.canvasWidth / 2, y: -canvasConfig.canvasHeight / 2 }
        // { x: canvasConfig.offsetX - , y: -(canvasConfig.canvasHeight - canvasConfig.a4Height) / 2 }
        // { x: -300, y: -300 }
        // { x: 0, y: 0 }
    );
    const [isDrag, setIsDrag] = useState(false);
    const [cursorCoords, setCursorCoords] = useState({ x: 0, y: 0});
    const projectStore: TProjectStore = useRootStore().getProjectStore();
    const usersStore: TUsersStore = useRootStore()!.getUsersStore();
    const userStore: TUserStore = useRootStore()!.getUserStore();
    const project = projectStore.getProject();
    const actionStore: TActionStore = useRootStore().getActionStore();

    const [currentPage, setCurrentPage] = useState(projectStore.getProject()?.getCurrentPage());

    const svgCanvas: React.MutableRefObject<SVGSVGElement | null> = useRef(null);

    useEffect(() => {
        project?.getCurrentPage() && setCurrentPage(project?.getCurrentPage())
    }, [project]);
    // const handleAlt = (e: KeyboardEvent) => {
    //     if (e.altKey) {
    //         console.log('ee')
    //         setScrollIsActive((prev) => !prev);
    //     }
    // };

    // useEffect(() => {
    //     document.addEventListener("keydown", handleAlt);
    //     document.addEventListener("keyup", handleAlt);
    //     return () => {
    //         document.removeEventListener("keydown", handleAlt);
    //         document.removeEventListener("keyup", handleAlt);
    //     };
    // }, []);


    //let svgChildren = useRootStore()!.getProjectStore().getProjects().at(0)!.renderedShapes!;

    // const [svgChildren, setSVGChildren] = useState<ILayer[]>(
    //     //useRootStore()!.getProjectStore().getProjects().at(0)!.pages?.at(0)!.layers.at(0)!.shapes!
    //     useRootStore()!.getProjectStore().getProjects().at(0)!.pages?.at(0)!.getLayers()
    // );

    // useEffect(() => {
    //     return function () {
    //         useRootStore()!.getProjectStore().getProjects().at(0)!.setShapes!(svgChildren);
    //     }
    // }, []);

    //const userStore = useRootStore()?.getUserStore()

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setCursorCoords({ x: event.clientX, y: event.clientY });
        };
    
        window.addEventListener('mousemove', handleMouseMove);
    
        return () => {
          window.removeEventListener(
            'mousemove',
            handleMouseMove
          );
        };
    }, [setCursorCoords]);

    useEffect(() => {
        svgCanvas.current?.addEventListener('wheel', wheelHandler);
        return () => svgCanvas.current?.removeEventListener('wheel', wheelHandler);
    });

    const [lastCursorUpdateTime, setLastCursorUpdateTime] = useState<number>(0);

    useEffect(() => {
        const coords = transformOuterCoordsToSVGCoords({
            x: cursorCoords.x,
            y: cursorCoords.y,
        })
        if (Date.now()-lastCursorUpdateTime > cursorUpdateTime){
            actionStore.push(new CursorPositionAction(projectStore.getProject()?.getCurrentPage()!, coords))
            projectStore.getProject()?.killOldCursors()
            setLastCursorUpdateTime(Date.now());
        }
    
        // const interval = setInterval(() => {
        //     const coords = transformOuterCoordsToSVGCoords({
        //         x: cursorCoords.x,
        //         y: cursorCoords.y,
        //     })
        //     actionStore.push(new CursorPositionAction(projectStore.getProject()?.getCurrentPage()!, coords))
        // }, cursorUpdateTime);
        
        // return () => clearInterval(interval);
    }, [cursorCoords])

    useEffect(() => {
        const coords = transformOuterCoordsToSVGCoords({
            x: cursorCoords.x,
            y: cursorCoords.y,
        })
        const intervalCursorPositions = setInterval(() => {
            actionStore.push(new CursorPositionAction(projectStore.getProject()?.getCurrentPage()!, coords))
        }, cursorUpdateTime);

        const intervalKillOldCursors = setInterval(() => {
            projectStore.getProject()?.killOldCursors()
        }, cursorUpdateTime);
        
        return () => {
            clearInterval(intervalCursorPositions);
            clearInterval(intervalKillOldCursors);
        }
    }, [cursorCoords])

    const cursorAnimations = useSprings(
        (project?.getCursors().filter(c => c.pageId === currentPage?.getID())
            .filter(c => c.userId !== (userStore.getData())?.id))!.length,
        (project?.getCursors().filter(c => c.pageId === currentPage?.getID())
            .filter(c => c.userId !== (userStore.getData())?.id))!.map(c => ({
            from: {
                cx: c.prevCoord.x,
                cy: c.prevCoord.y,
                r: "20", 
                fill: c.color,
                userId: c.userId, 
            },
            to: {
                cx: c.coord.x,
                cy: c.coord.y,
                r: "20", 
                fill: c.color,
                userId: c.userId,
            },
            config: { duration: cursorUpdateTime }
        })));

    // function moveSVGAt(shapeID: string, toSVGCoords: { x: number, y: number }, shift?: { x: number, y: number }) {
    //     currentPage?.setLayers(currentPage.getLayers().map(layer => {
    //         layer.shapes = layer.getShapes().map(item => {
    //             if (item.config.id === shapeID) {
    //                 let newData: IShapeProps = JSON.parse(JSON.stringify(item.config));
    //                 // newData.graphical.startCoords = {
    //                 //     x: Math.trunc(toSVGCoords.x - (shift ? shift.x : 0)),
    //                 //     y: Math.trunc(toSVGCoords.y - (shift ? shift.y : 0)),
    //                 // }
    //                 newData.graphical.x.value = Math.trunc(toSVGCoords.x - (shift?.x ?? 0)).toString();
    //                 newData.graphical.y.value = Math.trunc(toSVGCoords.y - (shift?.y ?? 0)).toString();
    //                 item.config = newData;
    //                 //console.log(item)
    //             }
    //             return item;
    //         })
    //         return layer;
    //     }));

    //     //updatePageCallback(currentPage);
    // }
    // let ps = useRootStore()!.getProjectStore()
    function moveSVGAt(shapeID: string, toSVGCoords: { x: number, y: number }, shift?: { x: number, y: number }) {
        setCurrentPage(new Page(currentPage?.getID(), currentPage?.getTitle(), currentPage!.getLayers().map(layer => {
            layer.setShapes(layer.getShapes().map(shapeItem => {
                if (shapeItem.config.id === shapeID) {
                    let newData: IShapeGraphicalProps = { ...shapeItem!.config.graphicalProperties };
                    newData.x.value = Math.trunc(toSVGCoords.x - (shift?.x ?? 0)).toString();
                    newData.y.value = Math.trunc(toSVGCoords.y - (shift?.y ?? 0)).toString();
                    shapeItem.config.graphicalProperties = newData;
                }
                return shapeItem;
            }))
            return layer
        })))
    }

    const svgDragNDrop = (e: React.MouseEvent<SVGGeometryElement>) => {
        const cur = e.currentTarget;
        cur.style.cursor = 'grabbing';
        const shift = {
            x: (e.clientX / scale - cur.getBoundingClientRect().left / scale), // смещение позиции курсора от позиции элемента по x
            // y: (e.clientY / scale - cur.getBoundingClientRect().top / scale), // по y
            y: (e.clientY / scale - cur.getBoundingClientRect().top / scale), // по y
        }
        const shapeID = e.currentTarget.id;
        let movableShape: IShape | undefined = undefined;
        let oldShape: IShape | undefined = undefined;
        let layerID = "";
        currentPage?.getLayers().every(layer => {
            const curShape = layer.getShapes().find(shape => shape.config.id === shapeID);
            if (curShape) {
                movableShape = curShape;
                oldShape = JSON.parse(JSON.stringify(curShape));
                layerID = layer.getID();
                return false;
            }
            return true;
        })
        const curRect = e.currentTarget.getBBox();
        let isMoved = false;
        function onMouseMove(event: MouseEvent) {
            !isMoved && (isMoved = true);
            // let SVGPoint = transformOuterCoordsToSVGCoords({
            //     x: event.pageX * scale - translate.x * scale,
            //     y: event.pageY * scale - translate.y * scale
            // });
            let SVGPoint = transformOuterCoordsToSVGCoords({
                x: event.pageX,
                y: event.pageY
            });
            let toCoords = { x: SVGPoint.x, y: SVGPoint.y };
            //console.log(scale, { x: (svg!.getBBox().width - svg!.getBBox().width / scale) / (1 - scale), y: (svg!.getBBox().height - svg!.getBBox().height / scale) / (1 - scale) });
            moveSVGAt(movableShape!.config.id!, toCoords, shift);
            svgSelect({ id: shapeID, domRect: curRect });
            // el.style.transform = `translate(${Math.trunc(toCoords.x - (shift?.x ?? 0)).toString()},${Math.trunc(toCoords.y - (shift?.y ?? 0)).toString()})`;
        }

        svgCanvas.current!.onmousemove = onMouseMove;
        svgCanvas.current!.onmouseup = () => {
            if (isMoved) {
                const moveShapeAction = new ChangeShapePropertyAction(oldShape!, layerID, movableShape!.config.graphicalProperties);
                actionStore.push(moveShapeAction);
                isMoved = false;
            }
            svgCanvas.current!.onmousemove = null;
            svgCanvas.current!.onmouseup = null;
            cur.style.cursor = 'auto';
        }
    }

    // const svgDragNDrop = (e: React.MouseEvent<SVGGeometryElement>) => {
    //     const cur = e.currentTarget;
    //     const originPoint = {
    //         x: e.pageX,
    //         y: e.pageY
    //     }
    //     const shift = {
    //         x: (e.clientX / scale - cur.getBoundingClientRect().left / scale), // смещение позиции курсора от позиции элемента по x
    //         y: (e.clientY / scale - cur.getBoundingClientRect().top / scale), // по y
    //     }
    //     const curId = e.currentTarget.id;
    //     const curRect = e.currentTarget.getBBox();
    //     // const shadow = React.createElement('g', null, React.cloneElement(e.currentTarget as unknown as ReactElement<SVGGeometryElement>) )
    //     // const shadow = document.createElement('g');
    //     // const shadowInner = e.currentTarget.cloneNode(true) as SVGGeometryElement;
    //     // shadow.appendChild(shadowInner);
    //     // const shadow = e.currentTarget.cloneNode(true) as SVGGeometryElement;
    //     // shadow.style.position = 'absolute';
    //     // shadow.props.style?.transform = '';
    //     svgCanvas.current?.getElementById('elementsGroup').appendChild(shadow);
    //     shadow.style.transform = `translate(0,0)`;
    //     // moveSVGAt()

    //     function onMouseMove(event: MouseEvent) {
    //         // shadow.style.left = event.pageX - shift.x + 'px';
    //         // shadow.style.top = event.pageY - shift.y + 'px';
    //         shadow.style.transform = `translate(${originPoint.x + event.pageX - shift.x + 'px'}, ${originPoint.y + event.pageY - shift.y + 'px'})`
    //         // let SVGPoint = transformOuterCoordsToSVGCoords({
    //         //     x: event.pageX * scale - translate.x * scale,
    //         //     y: event.pageY * scale - translate.y * scale
    //         // });
    //         // let SVGPoint = transformOuterCoordsToSVGCoords({
    //         //     x: event.pageX,
    //         //     y: event.pageY
    //         // });
    //         // let toCoords = { x: SVGPoint.x, y: SVGPoint.y };
    //         //console.log(scale, { x: (svg!.getBBox().width - svg!.getBBox().width / scale) / (1 - scale), y: (svg!.getBBox().height - svg!.getBBox().height / scale) / (1 - scale) });

    //         // moveSVGAt(cur.id, toCoords, shift);
    //         // svgSelect({ id: curId, domRect: curRect });
    //     }

    //     svgCanvas.current!.onmousemove = onMouseMove;
    //     svgCanvas.current!.onmouseup = () => {
    //         // svgCanvas.current?.removeChild(shadow);
    //         // let SVGPoint = transformOuterCoordsToSVGCoords({
    //         //     x: event.pageX,
    //         //     y: event.pageY
    //         // });
    //         // let toCoords = { x: SVGPoint.x, y: SVGPoint.y };

    //         svgCanvas.current!.onmousemove = null;
    //         svgCanvas.current!.onmouseup = null;
    //     }
    // }

    const svgClickHandler = (e: React.MouseEvent<SVGElement>) => {
        // const svg = e.currentTarget as SVGSVGElement;
        //const NS = svg.getAttribute('xmlns');
        const pt = svgCanvas.current!.createSVGPoint();

        // pass event coordinates
        pt.x = e.clientX;
        pt.y = e.clientY;
    }

    const transformOuterCoordsToSVGCoords = (coords: { x: number, y: number }) => {
        // const svg = document.querySelector('#canvas svg') as SVGSVGElement;
        const g = svgCanvas.current!.querySelector('#elementsGroup') as SVGSVGElement; //document.querySelector('#canvas svg>g') as SVGSVGElement;
        //const NS = svgCanvas.getAttribute('xmlns');
        const pt = svgCanvas.current!.createSVGPoint();

        // pass event coordinates
        pt.x = coords.x;
        pt.y = coords.y;

        // трансформация в SVG координаты
        const svgP = pt.matrixTransform(g.getScreenCTM()!.inverse());
        svgP.x = Math.trunc(svgP.x);
        svgP.y = Math.trunc(svgP.y);
        //console.log(svgP)
        return svgP;
    }

    const onMousemoveCaptureHandler = (e: React.MouseEvent<SVGElement>) => {
        //const SVGCursorCoords = transformOuterCoordsToSVGCoords({ x: e.pageX, y: e.pageY });
        //getCursorCoordsCallback(SVGCursorCoords);
    }

    function svgSelect(e: React.MouseEvent<SVGGeometryElement>): void;
    function svgSelect(e: { id: string, domRect: DOMRect }): void;
    function svgSelect(e: any): void {
        let curObj: IShape | undefined;
        currentPage?.getLayers().some(layer => {
            curObj = layer.getShapes().find(item => {
                return item.config.id === (e.currentTarget?.id ?? e.id);
            })
            return typeof (curObj) !== 'undefined';
        });
        // const userCoords = toUserCoordSystem({ x: +curObj!.config.graphicalProperties.x.value, y: +curObj!.config.graphicalProperties.y.value });
        const config: IShapeProps = {
            id: curObj!.config.id!,
            type: curObj!.type,
            // size: {
            //     w: Math.round(e.currentTarget?.getBBox().width ?? e.domRect.width),
            //     h: Math.round(e.currentTarget?.getBBox().height ?? e.domRect.height)
            // },
            graphProps: {
                ...curObj!.config.graphicalProperties,
                x: { ...curObj!.config.graphicalProperties.x, value: curObj!.config.graphicalProperties.x.value },
                y: { ...curObj!.config.graphicalProperties.y, value: curObj!.config.graphicalProperties.y.value }
                // w: {
                //     label: 'width',
                //     value: `${Math.round(e.currentTarget?.getBBox().width ?? e.domRect.width)}`,
                //     isReadable: true,
                // } as IGraphicalProperty,
                // h: {
                //     label: 'height',
                //     value: `${Math.round(e.currentTarget?.getBBox().height ?? e.domRect.height)}`,
                //     isReadable: true,
                // } as IGraphicalProperty
            }
        }
        getClickedShapeConfigCallback(config);
    }

    const onDropHandler = (e: React.DragEvent) => {
        if (e.dataTransfer.getData("draggableElement") !== 'shape') {
            return;
        }
        const dropCoords = transformOuterCoordsToSVGCoords({
            x: e.pageX,
            y: e.pageY,
        })

        const newShape: IShape = creatorOnDrop!.create();
        let drawShapeAction = new AddShapeAction(newShape, currentPage?.getCurrentLayer()!, dropCoords)
        actionStore.push(drawShapeAction);
    }

    const fitToBorder = (translatePoint: { x: number, y: number }, scaleVal: number = scale) => {
        // return;
        const canvasWidth = (svgCanvas.current?.closest('#canvas') as HTMLDivElement).offsetWidth;
        const canvasHeight = (svgCanvas.current?.closest('#canvas') as HTMLDivElement).offsetHeight;

        // левая граница
        if (translatePoint.x > 0)
            translatePoint.x = 0;

        // правая граница
        if (translatePoint.x - canvasWidth < -(canvasConfig.canvasWidth) * scaleVal)
            translatePoint.x = -(canvasConfig.canvasWidth * scaleVal - canvasWidth);

        // верхняя граница
        if (translatePoint.y > 0)
            translatePoint.y = 0;

        // нижняя граница
        if (translatePoint.y - canvasHeight < -(canvasConfig.canvasHeight) * scaleVal)
            translatePoint.y = -(canvasConfig.canvasHeight * scaleVal - canvasHeight);

        // центровка, если вьюпорт больше канвы
        if (canvasConfig.canvasWidth * scaleVal < canvasWidth) {
            translatePoint.x = canvasWidth / 2 - canvasConfig.canvasWidth * scaleVal / 2;

            if (canvasConfig.canvasHeight * scaleVal < canvasHeight) {
                translatePoint.y = canvasHeight / 2 - canvasConfig.canvasHeight * scaleVal / 2;
            }
        }
    }

    function toScale(nextScale: number, originPoint: { x: number, y: number } = { x: canvasConfig.canvasWidth / 2, y: canvasConfig.canvasHeight / 2 }) {
        // const g = svgCanvas.current!.querySelector('#elementsGroup') as SVGSVGElement;
        // const g = svgCanvas.current as SVGElement;
        // originPoint ??= { x: canvasConfig.a4Width / 2, y: canvasConfig.a4Height / 2 };
        // originPoint = transformOuterCoordsToSVGCoords(originPoint);
        // console.log(originPoint)


        // setTimeout(() => {
        const divis = nextScale / scale;

        const translatePoint: { x: number, y: number } = {
            x: divis * (translate.x - originPoint.x) + originPoint.x,
            y: divis * (translate.y - originPoint.y) + originPoint.y
        }

        fitToBorder(translatePoint, nextScale);
        setTranslate(translatePoint);
        setScale(nextScale);
    }

    // const onWheelHandler = (e: React.WheelEvent<SVGSVGElement>) => {
    function wheelHandler(e: WheelEvent) {
        e.preventDefault();
        const delta = e.deltaY || e.deltaX;
        const scaleStep = Math.abs(delta) < 50
            ? 0.05 // тачпад
            : 0.25; // мышь

        const scaleDelta = delta < 0 ? scaleStep : -scaleStep;
        const nextScale = scale + scaleDelta;

        const originPoint = { x: e.offsetX, y: e.offsetY };

        if (nextScale > 0.1 && nextScale < 2) {
            toScale(
                nextScale,
                originPoint
            )
        }
    };

    const onPointerDownHandler = (e: React.PointerEvent<SVGSVGElement>) => {
        if ((e.target as SVGAElement).getAttribute('role') === 'shape') { return; }
        setIsDrag(true);
        const initialPoint = {
            x: e.clientX,
            y: e.clientY,
        }
        e.currentTarget.onpointermove = (ev: PointerEvent) => {
            const currentPoint = {
                x: ev.clientX,
                y: ev.clientY,
            }
            let translatePoint: { x: number, y: number } = {
                x: translate.x + (currentPoint.x - initialPoint.x),
                y: translate.y + (currentPoint.y - initialPoint.y)
            };

            fitToBorder(translatePoint);
            setTranslate(translatePoint);
        }
        const unset = (ev: PointerEvent) => {
            (ev.currentTarget! as SVGSVGElement).onpointerup = null;
            (ev.currentTarget! as SVGSVGElement).onpointermove = null;
            setIsDrag(false);
        }
        e.currentTarget.onpointerleave = unset;
        e.currentTarget.onpointerup = unset;
    }

    const toUserCoordSystem = (coords: { x: number, y: number }) => ({ ...coords, y: (canvasConfig.canvasHeight - canvasConfig.offsetY * 2) - coords.y });
    const fromUserCoordSystem = toUserCoordSystem;

    return (
        <>
            <div id="canvas" onDrop={onDropHandler} onDragOver={e => e.preventDefault()} className={isDrag ? 'drag' : ''} >
                <svg
                    onPointerDown={onPointerDownHandler}

                    // style={{
                    //     backgroundColor: canvasConfig.sheetFillColor,
                    //     backgroundPosition: `${translate.x}px ${translate.y}px`,
                    //     // backgroundSize: `${canvasConfig.a4Width * scale - 1}px ${canvasConfig.a4Height * scale - 1}px,
                    //     // ${canvasConfig.a4Width * scale - 1}px ${canvasConfig.a4Height * scale - 1}px,
                    //     // ${(Math.floor(svgCanvas.current!.getBoundingClientRect().width / canvasConfig.gridStep) + 1) * canvasConfig.gridStep}px ${(Math.floor(svgCanvas.current!.getBoundingClientRect().height / canvasConfig.gridStep) + 1) * canvasConfig.gridStep}px,
                    //     // ${(Math.floor(svgCanvas.current!.getBoundingClientRect().width / canvasConfig.gridStep) + 1) * canvasConfig.gridStep}px ${(Math.floor(svgCanvas.current!.getBoundingClientRect().height / canvasConfig.gridStep) + 1) * canvasConfig.gridStep}px,
                    //     // ${(Math.floor(svgCanvas.current!.getBoundingClientRect().width / canvasConfig.gridStep) + 1) * canvasConfig.gridStep}px ${(Math.floor(svgCanvas.current!.getBoundingClientRect().height / canvasConfig.gridStep) + 1) * canvasConfig.gridStep}px,
                    //     // ${(Math.floor(svgCanvas.current!.getBoundingClientRect().width / canvasConfig.gridStep) + 1) * canvasConfig.gridStep}px ${(Math.floor(svgCanvas.current!.getBoundingClientRect().height / canvasConfig.gridStep) + 1) * canvasConfig.gridStep}px
                    //     // `,
                    //     backgroundSize: `${canvasConfig.a4Width * scale - 1}px ${canvasConfig.a4Height * scale - 1}px,
                    //     ${canvasConfig.a4Width * scale - 1}px ${canvasConfig.a4Height * scale - 1}px,
                    //     ${canvasConfig.gridStep}px ${canvasConfig.gridStep}px,
                    //     ${canvasConfig.gridStep}px ${canvasConfig.gridStep}px,
                    //     ${canvasConfig.gridStep}px ${canvasConfig.gridStep}px,
                    //     ${canvasConfig.gridStep}px ${canvasConfig.gridStep}px
                    //     `,
                    //     backgroundRepeat: 'repeat',
                    //     backgroundImage: `linear-gradient(0deg, ${canvasConfig.sheetStrokeColor} 1px, transparent 0px), 
                    //     linear-gradient(90deg, ${canvasConfig.sheetStrokeColor} 1px, transparent 0px),
                    //     repeating-linear-gradient(90deg, transparent 0 ${canvasConfig.gridStep - 1}px, ${canvasConfig.gridColor} 0px ${canvasConfig.gridStep}px),
                    //     repeating-linear-gradient(0deg, transparent 0 ${canvasConfig.gridStep - 1}px, ${canvasConfig.gridColor} 0px ${canvasConfig.gridStep}px),
                    //     repeating-linear-gradient(90deg, transparent 0 ${canvasConfig.subgridStep - 1}px, ${canvasConfig.subgridColor} 0px ${canvasConfig.subgridStep}px),
                    //     repeating-linear-gradient(0deg, transparent 0 ${canvasConfig.subgridStep - 1}px, ${canvasConfig.subgridColor} 0px ${canvasConfig.subgridStep}px)
                    //     `
                    // }}
                    preserveAspectRatio='xMinYMin meet'
                    width={canvasConfig.canvasWidth}
                    height={canvasConfig.canvasHeight}

                // width="100%"
                // height="100%"
                // style={{ transform: `matrix(${scale}, 0, 0, ${scale}, ${translate.x}, ${translate.y})` }}

                // viewBox={`0 0 ${canvasConfig.canvasWidth} ${canvasConfig.canvasHeight}`}
                // viewBox={`0 0 1920 768`}
                >
                    <defs>
                        <pattern id="subgridPattern" width={canvasConfig.subgridStep / scale} height={canvasConfig.subgridStep / scale} patternUnits="userSpaceOnUse">
                            <path d={`M ${canvasConfig.subgridStep / scale} 0 L 0 0 0 ${canvasConfig.subgridStep / scale}`} fill="none" stroke={canvasConfig.subgridColor} strokeWidth="1" />
                        </pattern>
                        <pattern id="gridPattern" width={canvasConfig.gridStep / scale} height={canvasConfig.gridStep / scale} patternUnits="userSpaceOnUse">
                            <rect width={canvasConfig.gridStep / scale} height={canvasConfig.gridStep / scale} fill="url(#subgridPattern)" stroke={canvasConfig.gridColor} strokeWidth="1" />
                        </pattern>
                        <pattern id="a4Pattern" width={canvasConfig.a4Width} height={canvasConfig.a4Height} patternUnits="userSpaceOnUse">
                            <path d={`M ${canvasConfig.a4Width} 0 L 0 0 0 ${canvasConfig.a4Height}`} fill="none" stroke={canvasConfig.sheetStrokeColor} strokeWidth="2" />
                        </pattern>
                        <g id="gridRect" x={canvasConfig.offsetX} y={canvasConfig.offsetY}>
                            <rect width={canvasConfig.canvasWidth - canvasConfig.offsetX * 2} height={canvasConfig.canvasHeight - canvasConfig.offsetY * 2} fill={canvasConfig.sheetFillColor} />
                            <rect width={canvasConfig.canvasWidth - canvasConfig.offsetX * 2} height={canvasConfig.canvasHeight - canvasConfig.offsetY * 2} fill="url(#a4Pattern)" />
                            <rect width={canvasConfig.canvasWidth - canvasConfig.offsetX * 2} height={canvasConfig.canvasHeight - canvasConfig.offsetY * 2} fill="url(#gridPattern)" stroke={canvasConfig.sheetStrokeColor} strokeWidth={2} />
                        </g>
                    </defs>
                    <g style={{ transform: `matrix(${scale}, 0, 0, ${scale}, ${translate.x}, ${translate.y}) ` }}>
                        <svg
                            ref={svgCanvas}
                            // fill="url(#gridRect)"
                            // x={(canvasConfig.canvasWidth - canvasConfig.a4Width) / 2}
                            // y={(canvasConfig.canvasHeight - canvasConfig.a4Height) / 2}
                            // width={canvasConfig.a4Width}
                            // height={canvasConfig.a4Height}
                            // width="100%"
                            // height="100%"
                            width={canvasConfig.canvasWidth - canvasConfig.offsetX * 2}
                            height={canvasConfig.canvasHeight - canvasConfig.offsetY * 2}
                            x={canvasConfig.offsetX}
                            y={canvasConfig.offsetY}


                        // x={canvasConfig.offsetX}
                        // y={canvasConfig.offsetY}
                        // stroke='black'
                        // strokeWidth={2}
                        // viewBox={`0 0 ${canvasConfig.a4Width}px ${canvasConfig.a4Height}px`}
                        // xmlns="http://www.w3.org/2000/svg"
                        // onClick={svgClickHandler}
                        // onWheel={onWheelHandler}
                        // onPointerDown={onPointerDownHandler}
                        // onMouseMoveCapture={onMousemoveCaptureHandler}
                        // style={{ background: 'red', overflow: 'visible', fill: 'red' }}
                        >
                            <use href="#gridRect" />
                            <g id="elementsGroup" style={{
                                // outline: '2px solid #000000',
                                // transform: `matrix(${scale}, 0, 0, ${scale}, ${translate.x}, ${translate.y})`,
                                // transformOrigin: 'center
                            }}>
                                {currentPage?.getLayers().map((layer: ILayer) => layer.getShapes().map(s => {
                                    return s.render(svgDragNDrop, svgSelect, layer.getZIndex());
                                }))}
                                {cursorAnimations.map(a => <animated.path 
                                        d={`M${a.cx.get()} ${a.cy.get()} l32 12 l-15 5 l-4 16Z`}
                                        fill={a.fill} stroke="#5B5959" stroke-width="2">
                                        <title>{usersStore.getData().find(u => u.id === a.userId.get())?.name}</title>
                                    </animated.path>)
                                }
                            </g>
                        </svg>
                    </g>
                </svg>
            </div>
            <RangeInput
                value={scale}
                min={10}
                max={200}
                step={10}
                numberInputMax={1000}
                onChangeHandler={(val: string) => toScale(parseFloat((parseInt(val) * 0.01).toFixed(1)))} />
        </>
    )
})

export default SVGCanvas;