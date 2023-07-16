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
import IShape, { GraphicalPropertyTypes, IShapeGraphicalProps } from '../../model/shapes/IShape';
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
  const [cursorCoords, setCursorCoords] = useState({ x: 0, y: 0 });
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
    if (Date.now() - lastCursorUpdateTime > cursorUpdateTime) {
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
  // function moveSVGAt(shapeID: string, offset: { x: number, y: number }) {
  //   setCurrentPage(new Page(currentPage?.getID(), currentPage?.getTitle(), currentPage!.getLayers().map(layer => {
  //     layer.setShapes(layer.getShapes().map(shapeItem => {
  //       if (shapeItem.config.id === shapeID) {
  //         let newData: IShapeGraphicalProps = { ...shapeItem!.config.graphicalProperties };
  //         newData[GraphicalPropertyTypes.X].value = Math.trunc(+newData[GraphicalPropertyTypes.X].value + offset.x).toString();
  //         newData[GraphicalPropertyTypes.Y].value = Math.trunc(+newData[GraphicalPropertyTypes.Y].value + offset.y).toString();
  //         shapeItem.config.graphicalProperties = newData;
  //       }
  //       return shapeItem;
  //     }))
  //     return layer
  //   })))
  // }

  const svgDragNDrop = (e: React.MouseEvent<SVGGeometryElement>) => {
    // selectedShapes.forEach((shapeId: string) => {
    const cur = e.currentTarget;
    // const cur = currentPage?.getLayers().flatMap(layer=>layer.getShapes()).find(shape=>shape.config.id === shapeId)!;
    // const cur: SVGSVGElement = svgCanvas.current?.querySelector(`[data-id="${shapeId}"]`)!;
    !selectedShapes.length && setSelectedShapes(prev => [...prev, cur.dataset.id!]);
    const shapes: SVGSVGElement[] = selectedShapes.map(shapeId => svgCanvas.current?.querySelector(`[data-id="${shapeId}"]`)!);
    cur.style.cursor = 'grabbing';
    // const shift = {
    //   x: (e.clientX / scale - cur.getBoundingClientRect().left / scale), // смещение позиции курсора от позиции элемента по x
    //   // y: (e.clientY / scale - cur.getBoundingClientRect().top / scale), // по y
    //   y: (e.clientY / scale - cur.getBoundingClientRect().top / scale), // по y
    // }
    const shifts = shapes.map(shape => ({
      x: (e.clientX / scale - shape.getBoundingClientRect().left / scale), // смещение позиции курсора от позиции элемента по x
      y: (e.clientY / scale - shape.getBoundingClientRect().top / scale), // по y
    }))
    // const shapeID = e.currentTarget.dataset.id!;
    let movableShapes: IShape[] = [];
    let oldShapes: IShape[] = [];
    let layerIDs: string[] = [];
    selectedShapes.forEach(shapeId =>
      currentPage?.getLayers().every(layer => {
        const curShape = layer.getShapes().find(shape => shape.config.id === shapeId);
        if (curShape) {
          movableShapes.push(curShape);
          oldShapes.push(JSON.parse(JSON.stringify(curShape)));
          layerIDs.push(layer.getID());
          return false;
        }
        return true;
      })
    )
    // const BBoxes = shapes.map(shape => shape.getBBox());
    // e.currentTarget.getBBox();
    let isMoved = false;
    // const iniitialContourCoords = { x: controlsConfig.x, y: controlsConfig.y };
    function onMouseMove(event: MouseEvent) {
      !isMoved && (isMoved = true);

      let SVGPoint = transformOuterCoordsToSVGCoords({
        x: event.pageX,
        y: event.pageY
      });
      let toCoords = { x: SVGPoint.x, y: SVGPoint.y };
      // let offsetContour = {
      //   x: toCoords.x - iniitialContourCoords.x,
      //   y: toCoords.y - iniitialContourCoords.y
      // }
      // let shiftContour = {
      //   x: (e.clientX / scale - iniitialContourCoords.x / scale), // смещение позиции курсора от позиции элемента по x
      //   y: (e.clientY / scale - iniitialContourCoords.y / scale)
      // }
      // console.log(shiftContour)
      // setControlsConfig({ ...controlsConfig, x: (iniitialContourCoords.x + offsetContour.x) - shiftContour.x, y: (iniitialContourCoords.y + offsetContour.y) - shiftContour.y });
      movableShapes.forEach((shape, i) => {

        // let SVGPoint = transformOuterCoordsToSVGCoords({
        //     x: event.pageX * scale - translate.x * scale,
        //     y: event.pageY * scale - translate.y * scale
        // });

        // 
        //console.log(scale, { x: (svg!.getBBox().width - svg!.getBBox().width / scale) / (1 - scale), y: (svg!.getBBox().height - svg!.getBBox().height / scale) / (1 - scale) });
        // moveSVGAt(shape.config.id!, offset);
        moveSVGAt(shape.config.id!, toCoords, shifts[i]);
      })
      wrapSelectedShapesInContour();
      svgSelect({ id: cur.dataset.id!, domRect: cur.getBBox() });
      // el.style.transform = `translate(${Math.trunc(toCoords.x - (shift?.x ?? 0)).toString()},${Math.trunc(toCoords.y - (shift?.y ?? 0)).toString()})`;
    }

    svgCanvas.current!.onmousemove = onMouseMove;
    svgCanvas.current!.onmouseup = () => {
      if (isMoved) {
        oldShapes.forEach((oldShape, i) => {
          const moveShapeAction = new ChangeShapePropertyAction(oldShape, layerIDs[i], movableShapes[i].config.graphicalProperties);
          actionStore.push(moveShapeAction);
        })

        isMoved = false;
      }
      svgCanvas.current!.onmousemove = null;
      svgCanvas.current!.onmouseup = null;
      cur.style.cursor = 'auto';
    }
    // })
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
    // const SVGCursorCoords = transformOuterCoordsToSVGCoords({ x: e.pageX, y: e.pageY });
    // console.log(SVGCursorCoords)
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
    // const SVGCursorCoords = transformOuterCoordsToSVGCoords({ x: e.pageX, y: e.pageY });
    //getCursorCoordsCallback(SVGCursorCoords);
  }


  const [selectedShapes, setSelectedShapes] = useState<string[]>([]/*['64ac40f929a8cb47d17d3a39']*/);
  const [shiftIsPressed, setShiftIsPressed] = useState<boolean>(false);
  // const [controlsCoords, setControlsCoords] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [controlsConfig, setControlsConfig] = useState<{ x: number, y: number, w: number, h: number, offset: number, opacity: number }>({ x: 0, y: 0, w: 0, h: 0, offset: 5, opacity: 0 });

  function svgSelect(e: React.FocusEvent<SVGGeometryElement>): void;
  function svgSelect(e: { id: string, domRect: DOMRect }): void;
  function svgSelect(e: any): void {
    let curObj: IShape | undefined;
    currentPage?.getLayers().some(layer => {
      curObj = layer.getShapes().find(item => {
        return item.config.id === (e.currentTarget?.dataset.id ?? e.id);
      })
      return typeof (curObj) !== 'undefined';
    });
    // !selectedShapes.length &&
    // shiftIsPressed && console.log('sh')
    (shiftIsPressed || (!shiftIsPressed && !selectedShapes.length)) && setSelectedShapes(prev => [...prev, curObj!.config.id!]);
    // const userCoords = toUserCoordSystem({ x: +curObj!.config.graphicalProperties.x.value, y: +curObj!.config.graphicalProperties.y.value });
    const userCoords = toCartesianCoordSystem({ x: +curObj!.config.graphicalProperties.x.value, y: +curObj!.config.graphicalProperties.y.value });
    const config: IShapeProps = {
      id: curObj!.config.id!,
      type: curObj!.type,
      graphProps: {
        ...curObj!.config.graphicalProperties,
        // x: { ...curObj!.config.graphicalProperties.x, value: curObj!.config.graphicalProperties.x.value },
        // y: { ...curObj!.config.graphicalProperties.y, value: curObj!.config.graphicalProperties.y.value }
        x: { ...curObj!.config.graphicalProperties.x, value: userCoords.x.toString() },
        y: { ...curObj!.config.graphicalProperties.y, value: userCoords.y.toString() }
      }
    }
    getClickedShapeConfigCallback(config);
  }

  const wrapSelectedShapesInContour = () => {
    const rect = svgCanvas.current?.querySelector('#selectionContour');

    const shapes = selectedShapes.map(id => svgCanvas.current?.querySelector(`[data-id="${id}"]`))
      .filter(i => i) as SVGElement[];
    //currentPage?.getLayers().flatMap(layer => layer.getShapes()).find(shape => shape.config.id === selectedShapes);

    if (rect && shapes.length) {
      const coords = shapes.map(shape => {
        const clientRect = shape.getBoundingClientRect(); console.log(clientRect)
        return ({
          startCoords: transformOuterCoordsToSVGCoords({ x: clientRect.left, y: clientRect.top }),
          endCoords: transformOuterCoordsToSVGCoords({ x: clientRect.right, y: clientRect.bottom })
        })
      })
      const leftBorderCoord = coords.reduce((a, b) => a.startCoords.x < b.startCoords.x ? a : b).startCoords.x;
      const topBorderCoord = coords.reduce((a, b) => a.startCoords.y < b.startCoords.y ? a : b).startCoords.y;
      const rightBorderCoord = coords.reduce((a, b) => a.endCoords.x > b.endCoords.x ? a : b).endCoords.x;
      const bottomBorderCoord = coords.reduce((a, b) => a.endCoords.y > b.endCoords.y ? a : b).endCoords.y;
      // console.log(bottomBorderCoord)
      setControlsConfig({
        ...controlsConfig,
        x: (leftBorderCoord - controlsConfig.offset),
        y: (topBorderCoord - controlsConfig.offset),
        w: (rightBorderCoord - leftBorderCoord + controlsConfig.offset * 2),
        h: (bottomBorderCoord - topBorderCoord + controlsConfig.offset * 2),
        opacity: 1
      })
    }
  }

  const hideContour = (e: React.FocusEvent) => {
    !shiftIsPressed && !(e.relatedTarget?.getAttribute('role') === 'control') && setSelectedShapes([]);
    setControlsConfig({ ...controlsConfig, opacity: 0 })
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.shiftKey && setShiftIsPressed(true);
      document.onkeyup = (e: KeyboardEvent) => {
        console.log(e)
        if ((e.code === 'ShiftLeft' || e.code === 'ShiftRight') && !e.shiftKey) {
          setShiftIsPressed(false);
          document.onkeyup = null;
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  // useEffect(() => {
  //     console.log(shiftIsPressed);
  // }, [translate]);

  useEffect(() => {
    selectedShapes.length && wrapSelectedShapesInContour();
  }, [selectedShapes]);

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
    if ((e.target as SVGAElement).getAttribute('role') === 'control') { return; }
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

  // const toUserCoordSystem = (coords: { x: number, y: number }) => ({ ...coords, y: (canvasConfig.canvasHeight - canvasConfig.offsetY * 2) - coords.y });
  // const fromUserCoordSystem = toUserCoordSystem;
  const toCartesianCoordSystem = ({ x, y }: { x: number, y: number }) =>
  ({
    x: -((canvasConfig.canvasWidth - canvasConfig.offsetX * 2) / 2 - x),
    y: ((canvasConfig.canvasHeight - canvasConfig.offsetY * 2) / 2 - y)
  })
  const fromCartesianCoordSystem = ({ x, y }: { x: number, y: number }) =>
  ({
    x: ((canvasConfig.canvasWidth - canvasConfig.offsetX * 2) / 2 + x),
    y: ((canvasConfig.canvasHeight - canvasConfig.offsetY * 2) / 2 - y)
  })

  enum ScaleControlType {
    LEFT_TOP = 'left-top',
    RIGHT_TOP = 'right-top',
    LEFT_BOTTOM = 'left-bottom',
    RIGHT_BOTTOM = 'right-bottom'
  }
  interface IScaleControlConfig {
    increment: (shift: { x: number, y: number }) => number,
    decrement: (shift: { x: number, y: number }) => number,
    isIncrease: (shift: { x: number, y: number }) => boolean,
    isDecrease: (shift: { x: number, y: number }) => boolean,
    getCoords: (inititalCoords: { x: number, y: number }, summand: number) => { x: number | null, y: number | null }
  }

  interface IScaleControlHandlerConfig {
    [ScaleControlType.LEFT_TOP]: IScaleControlConfig,
    [ScaleControlType.RIGHT_TOP]: IScaleControlConfig,
    [ScaleControlType.RIGHT_BOTTOM]: IScaleControlConfig,
    [ScaleControlType.LEFT_BOTTOM]: IScaleControlConfig,
  }

  const scaleControlsHandlerConfig: IScaleControlHandlerConfig = {
    [ScaleControlType.LEFT_TOP]: {
      isIncrease: (shift) => shift.x < 0 || shift.y < 0,
      increment: (shift) => Math.max(-shift.x, -shift.y),
      isDecrease: (shift) => shift.x > 0 && shift.y > 0,
      decrement: (shift) => Math.min(-shift.x, -shift.y),
      getCoords: (initialCoords, summand) => ({
        x: initialCoords.x - summand,
        y: initialCoords.y - summand
      })
    },
    [ScaleControlType.RIGHT_TOP]: {
      isIncrease: (shift) => shift.x > 0 || shift.y < 0,
      increment: (shift) => Math.max(shift.x, -shift.y),
      isDecrease: (shift) => shift.x < 0 && shift.y > 0,
      decrement: (shift) => Math.min(shift.x, shift.y),
      getCoords: (initialCoords, summand) => ({
        x: null,
        y: initialCoords.y - summand
      })
    },
    [ScaleControlType.RIGHT_BOTTOM]: {
      isIncrease: (shift) => shift.x > 0 || shift.y > 0,
      increment: (shift) => Math.max(shift.x, shift.y),
      isDecrease: (shift) => shift.x < 0 && shift.y < 0,
      decrement: (shift) => Math.min(shift.x, -shift.y),
      getCoords: (initialCoords, summand) => ({
        x: null,
        y: null
      })
    },
    [ScaleControlType.LEFT_BOTTOM]: {
      isIncrease: (shift) => shift.x < 0 || shift.y > 0,
      increment: (shift) => Math.max(-shift.x, shift.y),
      isDecrease: (shift) => shift.x > 0 && shift.y < 0,
      decrement: (shift) => Math.min(shift.x, shift.y),
      getCoords: (initialCoords, summand) => ({
        x: initialCoords.x - summand,
        y: null
      })
    }
  }

  const scaleControlHandler = (e: React.PointerEvent, type: ScaleControlType) => {
    const inititalPoint = transformOuterCoordsToSVGCoords({ x: e.pageX, y: e.pageY });
    const id = selectedShapes[0];
    const shape = currentPage!.getLayers().flatMap(layer => layer.getShapes()).find(shape => shape.config.id === id);
    const initialWidth = shape!.overallWidth!;
    const initialCoords = { x: +shape!.config.graphicalProperties.x.value, y: +shape!.config.graphicalProperties.y.value };
    const minSize = 10;
    svgCanvas.current!.onpointermove = (e: PointerEvent) => {
      const currentPoint = transformOuterCoordsToSVGCoords({ x: e.pageX, y: e.pageY });
      const shift = {
        x: currentPoint.x - inititalPoint.x,
        y: currentPoint.y - inititalPoint.y
      }
      if (scaleControlsHandlerConfig[type].isIncrease(shift)) {
        const increment = scaleControlsHandlerConfig[type].increment(shift);
        shape!.overallWidth = initialWidth + increment;
        const newCoords = scaleControlsHandlerConfig[type].getCoords(initialCoords, increment);
        newCoords.x && (shape!.config.graphicalProperties.x.value = newCoords.x.toString());
        newCoords.y && (shape!.config.graphicalProperties.y.value = newCoords.y.toString());
      }
      if (scaleControlsHandlerConfig[type].isDecrease(shift)) {
        const decrement = scaleControlsHandlerConfig[type].decrement(shift);
        const width = initialWidth + decrement;
        if (width >= minSize) {
          shape!.overallWidth = width;
          const newCoords = scaleControlsHandlerConfig[type].getCoords(initialCoords, decrement);
          newCoords.x && (shape!.config.graphicalProperties.x.value = newCoords.x.toString());
          newCoords.y && (shape!.config.graphicalProperties.y.value = newCoords.y.toString());
        }
      }
      setControlsConfig({
        ...controlsConfig,
        x: +shape!.config.graphicalProperties.x.value - controlsConfig.offset,
        y: +shape!.config.graphicalProperties.y.value - controlsConfig.offset,
        w: shape!.overallWidth! + controlsConfig.offset * 2,
        h: shape!.overallHeight! + controlsConfig.offset * 2
      })
    }
    svgCanvas.current!.onpointerup = (e: PointerEvent) => {
      svgCanvas.current!.onpointermove = null;
      svgCanvas.current!.onpointerup = null;
      const newProps = shape!.config.graphicalProperties;
      const currentLayer = currentPage?.getLayers().find(layer => layer.getShapes().some(curShape => curShape === shape!));
      if (currentLayer && shape) {
        const changePropAction = new ChangeShapePropertyAction(
          shape!,
          currentLayer.getID(),
          newProps,
        );
        actionStore.push(changePropAction);
      }
    }
  }



  return (
    <>
      <div id="canvas" onDrop={onDropHandler} onDragOver={e => e.preventDefault()} className={isDrag ? 'drag' : ''} >
        <svg
          ref={svgCanvas}
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
          {/* <g transform={`translate(-300,-300)`}> */}
          <g style={{ transform: `matrix(${scale}, 0, 0, ${scale}, ${translate.x}, ${translate.y}) ` }}>
            <use href="#gridRect" />
            <svg
              // fill="url(#gridRect)"
              // x={(canvasConfig.canvasWidth - canvasConfig.a4Width) / 2}
              // y={(canvasConfig.canvasHeight - canvasConfig.a4Height) / 2}
              // width={canvasConfig.a4Width}
              // height={canvasConfig.a4Height}
              // width="100%"
              // height="100%"
              width={canvasConfig.canvasWidth - canvasConfig.offsetX * 2}
              height={canvasConfig.canvasHeight - canvasConfig.offsetY * 2}
            // x={canvasConfig.offsetX}
            // y={canvasConfig.offsetY}

            // viewBox={`${(canvasConfig.canvasWidth - canvasConfig.offsetX * 2) / 2} ${(canvasConfig.canvasHeight - canvasConfig.offsetY * 2) / 2} ${canvasConfig.canvasWidth - canvasConfig.offsetX * 2} ${canvasConfig.canvasHeight - canvasConfig.offsetY * 2}`}



            // x={canvasConfig.offsetX}
            // y={canvasConfig.offsetY}
            // stroke='black'
            // strokeWidth={2}
            // viewBox={`${(canvasConfig.canvasWidth - canvasConfig.offsetX * 2) / 2} ${(canvasConfig.canvasHeight - canvasConfig.offsetY * 2) / 2} ${canvasConfig.canvasWidth - canvasConfig.offsetX * 2} ${canvasConfig.canvasHeight - canvasConfig.offsetY * 2}`}
            // viewBox={`${-translate.x} ${-translate.y} ${canvasConfig.canvasWidth - canvasConfig.offsetX * 2} ${canvasConfig.canvasHeight - canvasConfig.offsetY * 2}`}
            // xmlns="http://www.w3.org/2000/svg"
            // onClick={svgClickHandler}
            // onWheel={onWheelHandler}
            // onPointerDown={onPointerDownHandler}
            // onMouseMoveCapture={onMousemoveCaptureHandler}
            // style={{ background: 'red', overflow: 'visible', fill: 'red' }}
            >
              <g id="elementsGroup" style={{
                // outline: '2px solid #000000',
                // transform: `translate(-300, -3000)`,
                // transformOrigin: 'center
              }}>
                {currentPage?.getLayers().map((layer: ILayer) => layer.getShapes().map(s => {
                  return s.render(
                    svgDragNDrop,
                    // {
                    // selectedShapes.forEach(id => svgDragNDrop(e, id));
                    // const elem: SVGSVGElement = svgCanvas.current!.querySelector(`[data-id={${selectedShapes[0]}}]`)!;
                    // svgSelect({ id: selectedShapes[0], domRect: elem.getBoundingClientRect() });
                    // },
                    svgSelect,
                    // () => console.log(),
                    hideContour,
                    layer.getZIndex(), selectedShapes.includes(s.config.id!) ? true : false);
                }))}
                {cursorAnimations.map(a => <animated.path
                  d={`M${a.cx.get()} ${a.cy.get()} l32 12 l-15 5 l-4 16Z`}
                  fill={a.fill} stroke="#5B5959" strokeWidth="2">
                  <title>{usersStore.getData().find(u => u.id === a.userId.get())?.name}</title>
                </animated.path>)}
                {<g id='controls' transform={`translate(${controlsConfig.x},${controlsConfig.y})`} opacity={controlsConfig.opacity}>
                  {/* <rect id='selectionContour' width={controlsConfig.w} height={controlsConfig.h} /> */}
                  <g id='selectionContour'>
                    <line x1={0} x2={controlsConfig.w} y1={0} y2={0} />
                    <line x1={controlsConfig.w} x2={controlsConfig.w} y1={0} y2={controlsConfig.h} />
                    <line x1={controlsConfig.w} x2={0} y1={controlsConfig.h} y2={controlsConfig.h} />
                    <line x1={0} x2={0} y1={controlsConfig.h} y2={0} />
                    {/* <line x1={controlsConfig.x+controlsConfig.w} x2={controlsConfig.x+controlsConfig.w} y1={controlsConfig.y} y2={controlsConfig.y} />
                    <line x1={controlsConfig.x} x2={controlsConfig.x+controlsConfig.w} y1={controlsConfig.y} y2={controlsConfig.y} />
                    <line x1={controlsConfig.x} x2={controlsConfig.x+controlsConfig.w} y1={controlsConfig.y} y2={controlsConfig.y} /> */}
                  </g>
                  {selectedShapes.length === 1 && <g id='scaleControls'>
                    <circle role='control' data-control='left-top' r="5" tabIndex={-1}
                      onPointerDown={e => scaleControlHandler(e, ScaleControlType.LEFT_TOP)}
                      onBlur={hideContour}
                    />
                    <circle role='control' data-control='right-top' r="5" tabIndex={-1} transform={`translate(${controlsConfig.w},0)`}
                      onPointerDown={e => scaleControlHandler(e, ScaleControlType.RIGHT_TOP)}
                      onBlur={hideContour}
                    />
                    <circle role='control' data-control='left-bottom' r="5" tabIndex={-1} transform={`translate(0,${controlsConfig.h})`}
                      onPointerDown={e => scaleControlHandler(e, ScaleControlType.LEFT_BOTTOM)}
                      onBlur={hideContour}
                    />
                    <circle role='control' data-control='right-bottom' r="5" tabIndex={-1} transform={`translate(${controlsConfig.w},${controlsConfig.h})`}
                      onPointerDown={e => scaleControlHandler(e, ScaleControlType.RIGHT_BOTTOM)}
                      onBlur={hideContour}
                    />
                  </g>}
                </g>}
              </g>
            </svg>
            {/* </g> */}
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