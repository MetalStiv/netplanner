import React, { useEffect, useState, useRef } from 'react';
import { IShapeProps, IShape } from '../../model/IShape';
import { IElemProps } from '../../pages/ProjectPage/ProjectPage'
import IShapeCreator from '../../model/IShapeCreator';
import { ILayer } from '../../model/Layer';
import Page from '../../model/Page';
import ICanvasConfig from '../../common/canvasConfig';
import { DrawShapeAction } from '../../model/Action';
import { useRootStore } from '../../providers/rootProvider';
import { TActionStore } from '../../stores/actionStore';
import { observer } from 'mobx-react-lite';

interface SVGCanvasProps {
    currentPage: Page,
    //updatePageCallback: (page: Page) => void,
    canvasConfig: ICanvasConfig,
    //scale: number,
    creatorOnDrop: IShapeCreator | null,
    getCursorCoordsCallback: (cursorCoords: { x: number, y: number }) => void,
    getClickedElemConfigCallback: (elemProps: IElemProps) => void,
    //onWheelHandler: (e: React.WheelEvent<SVGSVGElement>) => void,
}

const SVGCanvas: React.FC<SVGCanvasProps> = observer(({ currentPage, canvasConfig,
    creatorOnDrop, getCursorCoordsCallback, getClickedElemConfigCallback }: SVGCanvasProps) => {
    const [scale, setScale] = useState<number>(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });

    const svgCanvas: React.MutableRefObject<SVGSVGElement | null> = useRef(null);

    const actionStore: TActionStore = useRootStore().getActionStore();
    // const projectId = useRootStore()!.getProjectStore().getProject()!.id;
    // app?.setProjectId(projectId)

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
    //     //useRootStore()!.getProjectStore().getProjects().at(0)!.pages?.at(0)!.layers.at(0)!.elems!
    //     useRootStore()!.getProjectStore().getProjects().at(0)!.pages?.at(0)!.getLayers()
    // );

    // useEffect(() => {
    //     return function () {
    //         useRootStore()!.getProjectStore().getProjects().at(0)!.setShapes!(svgChildren);
    //     }
    // }, []);

    //const userStore = useRootStore()?.getUserStore()

    useEffect(() => {
        svgCanvas.current?.addEventListener('wheel', wheelHandler);
        return () => svgCanvas.current?.removeEventListener('wheel', wheelHandler);
    });

    function moveSVGAt(elemID: string, toSVGCoords: { x: number, y: number }, shift?: { x: number, y: number }) {
        currentPage.setLayers(currentPage.getLayers().map(layer => {
            layer.elems = layer.getElems().map(item => {
                if (item.config.id === elemID) {
                    let newData: IShapeProps = JSON.parse(JSON.stringify(item.config));
                    // newData.graphical.startCoords = {
                    //     x: Math.trunc(toSVGCoords.x - (shift ? shift.x : 0)),
                    //     y: Math.trunc(toSVGCoords.y - (shift ? shift.y : 0)),
                    // }
                    newData.graphical.x.value = Math.trunc(toSVGCoords.x - (shift?.x ?? 0)).toString();
                    newData.graphical.y.value = Math.trunc(toSVGCoords.y - (shift?.y ?? 0)).toString();
                    item.config = newData;
                    //console.log(item)
                }
                return item;
            })
            return layer;
        }));

        //updatePageCallback(currentPage);
    }

    const svgDragNDrop = (e: React.MouseEvent<SVGGeometryElement>) => {
        const cur = e.currentTarget;
        const shift = {
            x: (e.clientX / scale - cur.getBoundingClientRect().left / scale), // смещение позиции курсора от позиции элемента по x
            y: (e.clientY / scale - cur.getBoundingClientRect().top / scale), // по y
        }
        const curId = e.currentTarget.id;
        const curRect = e.currentTarget.getBBox();
        function onMouseMove(event: MouseEvent) {
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
            moveSVGAt(cur.id, toCoords, shift);
            svgSelect({ id: curId, domRect: curRect });
        }

        svgCanvas.current!.onmousemove = onMouseMove;
        svgCanvas.current!.onmouseup = () => {
            svgCanvas.current!.onmousemove = null;
            svgCanvas.current!.onmouseup = null;
        }
    }

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
        currentPage.getLayers().some(layer => {
            curObj = layer.getElems().find(item => {
                return item.config.id === (e.currentTarget?.id ?? e.id);
            })
            return typeof (curObj) !== 'undefined';
        });
        const config: IElemProps = {
            type: curObj!.type,
            size: {
                w: Math.round(e.currentTarget?.getBBox().width ?? e.domRect.width),
                h: Math.round(e.currentTarget?.getBBox().height ?? e.domRect.height)
            },
            graphProps: curObj!.config.graphical
        }
        getClickedElemConfigCallback(config);
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
        let drawShapeAction = new DrawShapeAction(newShape, currentPage, dropCoords)
        // drawShapeAction.do() && actionStore.push(drawShapeAction)
        actionStore.push(drawShapeAction);
    }

    function toScale(nextScale: number, originPoint?: { x: number, y: number }) {
        const g = svgCanvas.current!.querySelector('#elementsGroup') as SVGSVGElement;
        originPoint ??= { x: g.getBBox().x + g.getBBox().width / 2, y: g.getBBox().y + g.getBBox().height / 2 };
        console.log(originPoint)
        const divis = nextScale / scale;
        setTranslate({
            x: divis * (translate.x - originPoint.x) + originPoint.x,
            y: divis * (translate.y - originPoint.y) + originPoint.y
        });
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
        const initialPoint = {
            x: e.clientX,
            y: e.clientY,
        }
        e.currentTarget.onpointermove = (ev: PointerEvent) => {
            const currentPoint = {
                x: ev.clientX,
                y: ev.clientY,
            }
            setTranslate({
                x: translate.x + (currentPoint.x - initialPoint.x),
                y: translate.y + (currentPoint.y - initialPoint.y)
            })
        }
        e.currentTarget.onpointerup = (ev: PointerEvent) => {
            (ev.currentTarget! as SVGSVGElement).onpointerup = null;
            (ev.currentTarget! as SVGSVGElement).onpointermove = null;
        }
    }

    const [sliderTextInput, setSliderTextInput] = useState('');
    return (
        <>
            <div id="canvas" onDrop={onDropHandler} onDragOver={e => e.preventDefault()}
            //style={{ width: canvasConfig.canvasWidth * scale, height: canvasConfig.canvasHeight * scale }}
            // style={{ width: canvasConfig.canvasWidth, height: canvasConfig.canvasHeight }}
            >
                <svg
                    ref={svgCanvas}
                    // viewBox={`0 0 ${canvasConfig.canvasWidth} ${canvasConfig.canvasHeight}`}
                    // xmlns="http://www.w3.org/2000/svg"
                    // onClick={svgClickHandler}
                    // onWheel={onWheelHandler}
                    onPointerDown={onPointerDownHandler}
                    onMouseMoveCapture={onMousemoveCaptureHandler}
                    style={{
                        backgroundColor: canvasConfig.sheetFillColor,
                        backgroundPosition: `${translate.x}px ${translate.y}px`,
                        // backgroundSize: `${canvasConfig.a4Width * scale - 1}px ${canvasConfig.a4Height * scale - 1}px,
                        // ${canvasConfig.a4Width * scale - 1}px ${canvasConfig.a4Height * scale - 1}px,
                        // ${(Math.floor(svgCanvas.current!.getBoundingClientRect().width / canvasConfig.gridStep) + 1) * canvasConfig.gridStep}px ${(Math.floor(svgCanvas.current!.getBoundingClientRect().height / canvasConfig.gridStep) + 1) * canvasConfig.gridStep}px,
                        // ${(Math.floor(svgCanvas.current!.getBoundingClientRect().width / canvasConfig.gridStep) + 1) * canvasConfig.gridStep}px ${(Math.floor(svgCanvas.current!.getBoundingClientRect().height / canvasConfig.gridStep) + 1) * canvasConfig.gridStep}px,
                        // ${(Math.floor(svgCanvas.current!.getBoundingClientRect().width / canvasConfig.gridStep) + 1) * canvasConfig.gridStep}px ${(Math.floor(svgCanvas.current!.getBoundingClientRect().height / canvasConfig.gridStep) + 1) * canvasConfig.gridStep}px,
                        // ${(Math.floor(svgCanvas.current!.getBoundingClientRect().width / canvasConfig.gridStep) + 1) * canvasConfig.gridStep}px ${(Math.floor(svgCanvas.current!.getBoundingClientRect().height / canvasConfig.gridStep) + 1) * canvasConfig.gridStep}px
                        // `,
                        backgroundSize: `${canvasConfig.a4Width * scale - 1}px ${canvasConfig.a4Height * scale - 1}px,
                        ${canvasConfig.a4Width * scale - 1}px ${canvasConfig.a4Height * scale - 1}px,
                        ${canvasConfig.gridStep}px ${canvasConfig.gridStep}px,
                        ${canvasConfig.gridStep}px ${canvasConfig.gridStep}px,
                        ${canvasConfig.gridStep}px ${canvasConfig.gridStep}px,
                        ${canvasConfig.gridStep}px ${canvasConfig.gridStep}px
                        `,
                        backgroundRepeat: 'repeat',
                        backgroundImage: `linear-gradient(0deg, ${canvasConfig.sheetStrokeColor} 1px, transparent 0px), 
                        linear-gradient(90deg, ${canvasConfig.sheetStrokeColor} 1px, transparent 0px),
                        repeating-linear-gradient(90deg, transparent 0 ${canvasConfig.gridStep - 1}px, ${canvasConfig.gridColor} 0px ${canvasConfig.gridStep}px),
                        repeating-linear-gradient(0deg, transparent 0 ${canvasConfig.gridStep - 1}px, ${canvasConfig.gridColor} 0px ${canvasConfig.gridStep}px),
                        repeating-linear-gradient(90deg, transparent 0 ${canvasConfig.subgridStep - 1}px, ${canvasConfig.subgridColor} 0px ${canvasConfig.subgridStep}px),
                        repeating-linear-gradient(0deg, transparent 0 ${canvasConfig.subgridStep - 1}px, ${canvasConfig.subgridColor} 0px ${canvasConfig.subgridStep}px)
                        `
                    }}
                >
                    <g id="elementsGroup" style={{
                        // outline: '2px solid #000000',
                        transform: `matrix(${scale}, 0, 0, ${scale}, ${translate.x}, ${translate.y})`,
                        // transformOrigin: 'center
                    }}>
                        {currentPage.getLayers().map((layer: ILayer) => layer.getElems().map(el => {
                            return el.render(svgDragNDrop, svgSelect, layer.zIndex);
                        }))}
                    </g>
                </svg>
            </div>
            <div id="scale-slider">
                <div id="slider-range">
                    <input type="range"
                        id="slider-range-input"
                        min={10}
                        max={200}
                        step={10}
                        value={Math.ceil(scale * 100)}
                        onChange={e => toScale(parseFloat((parseInt(e.target.value) * 0.01).toFixed(1)))}
                    />
                </div>
                <div id="slider-text">
                    <input id="slider-text-input"
                        type="text"
                        value={sliderTextInput}
                        onInput={e => {
                            const curVal = e.currentTarget.value;
                            if (parseInt(curVal) <= 1000 || curVal === '') {
                                setSliderTextInput(curVal);
                            }
                        }}
                        onKeyDown={e => {
                            if (e.keyCode === 13) {
                                toScale(parseFloat((parseInt(sliderTextInput) * 0.01).toFixed(1)));
                            }
                        }}
                    />
                    <label htmlFor="slider-text-input">%</label>
                </div>
            </div>
        </>
    )
})

export default SVGCanvas;