import React, { useEffect, useState, useRef } from 'react';
import { IShapeProps } from '../../pages/ProjectPage/ProjectPage'
import IShapeCreator from '../../model/shapes/IShapeCreator';
import ICanvasConfig from '../../common/canvasConfig';
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
import { DeleteShapeAction } from '../../model/actions/DeleteShapeAction';
import { ChangeGraphicalPropertyAction } from '../../model/actions/ChangeGraphicalPropertyAction';
import IConnectionPoint, { ConnectionPointTypes, IConnectionAddress } from '../../model/shapes/IConnectionPoint';
import { changeConnectionPointsHandler } from '../../model/actionHandlers/changeConnectionPointHandler';
import { ChangeConnectionPointsAction } from '../../model/actions/ChangeConnectionPointsAction';
import Connection from '../../model/shapes/Connection';
import ICoords from '../../common/model/ICoords';
import { TSvgInputStore } from '../../stores/svgInputStore';

interface SVGCanvasProps {
  // currentPage: Page,
  //updatePageCallback: (page: Page) => void,
  canvasConfig: ICanvasConfig,
  //scale: number,
  creatorOnDrop: IShapeCreator | null,
  getCursorCoordsCallback: (cursorCoords: ICoords) => void,
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

  const [selectedShapes, setSelectedShapes] = useState<string[]>([]/*['64ac40f929a8cb47d17d3a39']*/);
  const [shiftIsPressed, setShiftIsPressed] = useState<boolean>(false);
  // const [controlsCoords, setControlsCoords] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [controlsConfig, setControlsConfig] = useState<{ x: number, y: number, w: number, h: number, offset: number, isShow: boolean }>({ x: 0, y: 0, w: 0, h: 0, offset: 4, isShow: false });

  const [isDrag, setIsDrag] = useState(false);
  const [cursorCoords, setCursorCoords] = useState({ x: 0, y: 0 });
  const projectStore: TProjectStore = useRootStore().getProjectStore();
  const usersStore: TUsersStore = useRootStore()!.getUsersStore();
  const userStore: TUserStore = useRootStore()!.getUserStore();
  const svgInputStore: TSvgInputStore = useRootStore()!.getSvgInputStore();
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Delete') {
        // const currentLayer: ILayer = projectStore.getProject()
        //   ?.getCurrentPage()
        //   .getCurrentLayer()!;
        const selectedShapesObjects = selectedShapes.map(id => currentPage?.getLayers().flatMap(layer => layer.getShapes()).find(shape => shape.config.id === id)!);
        selectedShapesObjects.forEach(shape => {
          const layerId = currentPage?.getLayers().find(layer => layer.getShapes().includes(shape))!.getID()!;
          const deleteShapeAction = new DeleteShapeAction(shape, layerId);
          actionStore.push(deleteShapeAction);
        });
        setSelectedShapes([]);
        setControlsConfig({ ...controlsConfig, isShow: false });
      }
      if (e.ctrlKey && e.code === 'KeyC') {
        const currentLayer: ILayer = projectStore.getProject()
          ?.getCurrentPage()
          .getCurrentLayer()!
        let shapes = selectedShapes.map(ss => currentLayer.getShapes().find(s => s.config.id === ss))
          .filter((x): x is IShape => x !== undefined);
        shapes = JSON.parse(JSON.stringify(shapes))
        shapes.forEach(s => {
          s.config.id = undefined
        })
        localStorage.setItem('buffer', JSON.stringify(shapes))
      }
      if (e.ctrlKey && e.code === 'KeyX') {
        const currentLayer: ILayer = projectStore.getProject()
          ?.getCurrentPage()
          .getCurrentLayer()!
        let shapes = selectedShapes.map(ss => currentLayer.getShapes().find(s => s.config.id === ss))
          .filter((x): x is IShape => x !== undefined);
        shapes = JSON.parse(JSON.stringify(shapes))
        shapes.forEach(s => {
          s.config.id = undefined
        })
        localStorage.setItem('buffer', JSON.stringify(shapes))

        let shapesToDelete = selectedShapes.map(ss => currentLayer.getShapes().find(s => s.config.id === ss))
          .filter((x): x is IShape => x !== undefined);
        // shapesToDelete.forEach(shape => {
        //   const layerId = currentPage?.getLayers().find(layer => layer.getShapes().includes(shape))!.getID()!;
        //   const deleteShapeAction = new DeleteShapeAction(shape, layerId);
        //   actionStore.push(deleteShapeAction);
        // });
        const deleteShapeAction = new DeleteShapeAction(shapesToDelete[0], currentLayer?.getID());
        actionStore.push(deleteShapeAction);
        setSelectedShapes([]);
        setControlsConfig({ ...controlsConfig, isShow: false });
      }
      if (e.ctrlKey && e.code === 'KeyV') {
        const currentLayer: ILayer = projectStore.getProject()
          ?.getCurrentPage()
          .getCurrentLayer()!
        const shapesToAdd: IShape[] = JSON.parse(localStorage.getItem('buffer') || '') || [];
        const coords = transformOuterCoordsToSVGCoords({
          x: cursorCoords.x,
          y: cursorCoords.y,
        })
        const addShapeAction = new AddShapeAction(shapesToAdd[0], currentLayer, coords);
        actionStore.push(addShapeAction);
      }
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyM') {
        e.preventDefault();
        const currentLayer: ILayer = projectStore.getProject()
          ?.getCurrentPage()
          .getCurrentLayer()!
        let shapes = selectedShapes.map(ss => currentLayer.getShapes().find(s => s.config.id === ss))
          .filter((x): x is IShape => x !== undefined);
        shapes = JSON.parse(JSON.stringify(shapes))
        shapes.forEach(s => {
          s.config.graphicalProperties.my.value = (s.config.graphicalProperties.my.value ? parseInt(s.config.graphicalProperties.my.value.toString()) * -1 : -1).toString();
          var changeShapePropertyAction = new ChangeGraphicalPropertyAction(s, currentLayer.getID(), s.config.graphicalProperties);
          actionStore.push(changeShapePropertyAction);
        })
      }
      if (e.ctrlKey && !e.shiftKey && e.code === 'KeyM') {
        const currentLayer: ILayer = projectStore.getProject()
          ?.getCurrentPage()
          .getCurrentLayer()!
        let shapes = selectedShapes.map(ss => currentLayer.getShapes().find(s => s.config.id === ss))
          .filter((x): x is IShape => x !== undefined);
        shapes = JSON.parse(JSON.stringify(shapes))
        shapes.forEach(s => {
          s.config.graphicalProperties.mx.value = (s.config.graphicalProperties.my.value ? parseInt(s.config.graphicalProperties.mx.value.toString()) * -1 : -1).toString();
          var changeShapePropertyAction = new ChangeGraphicalPropertyAction(s, currentLayer.getID(), s.config.graphicalProperties);
          actionStore.push(changeShapePropertyAction);
        })
      }
      svgInputStore.addInputKey(e);
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedShapes]);

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
  function moveSVGAt(shapeID: string, toSVGCoords: ICoords, shift?: ICoords) {
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

  const svgDragNDrop = (e: React.PointerEvent<SVGGeometryElement>) => {
    // selectedShapes.forEach((shapeId: string) => {
    const cur = e.currentTarget;

    if (!currentPage?.getCurrentLayer().getShapes().some(s => s.config.id === cur.dataset.id)) {
      return
    }

    // if (selectedShapes.includes(cur.dataset.id!)) return;
    // const cur = currentPage?.getLayers().flatMap(layer=>layer.getShapes()).find(shape=>shape.config.id === shapeId)!;
    // const cur: SVGSVGElement = svgCanvas.current?.querySelector(`[data-id="${shapeId}"]`)!;

    // !selectedShapes.length && setSelectedShapes(prev => [...prev, cur.dataset.id!]);

    let selectedShapesLocal: string[] = selectedShapes;
    // let selectedShape: string | null = null;

    // if (!selectedShapesLocal.length) {
    //   selectedShapesLocal = [cur.dataset.id!];
    // } else {
    //   return;
    // }
    // !selectedShapes.length && (selectedShape = cur.dataset.id!);
    selectedShapesLocal = !selectedShapesLocal.length
      ? [cur.dataset.id!]
      : (shiftIsPressed
        ? [...selectedShapesLocal, cur.dataset.id!]
        : (!selectedShapesLocal.includes(cur.dataset.id!)
          ? [cur.dataset.id!]
          : selectedShapesLocal));
    setControlsConfig(prev => ({ ...prev, isShow: false }));

    // if (!selectedShapesLocal.length) { 
    //   selectedShapesLocal = [cur.dataset.id!];
    // } else {
    //   if (shiftIsPressed) {
    //     selectedShapesLocal = [...selectedShapesLocal, cur.dataset.id!];
    //   } else {
    //     !selectedShapesLocal.includes(cur.dataset.id!) && (selectedShapesLocal = []);
    //   }
    // }
    // shiftIsPressed && setSelectedShapes(prev => [...prev, cur.dataset.id!]);
    // !shiftIsPressed && setSelectedShapes([]);
    // shiftIsPressed && (selectedShapesLocal = [...selectedShapesLocal, cur.dataset.id!]);
    // !shiftIsPressed && !selectedShapesLocal.includes(cur.dataset.id!) && (selectedShapesLocal = []);
    // }

    // setSelectedShapes(selectedShapesLocal);
    // !selectedShapesLocal.length && (selectedShapesLocal = [cur.dataset.id!]);
    // ? (selectedShapes.includes(cur.dataset.id!) ? selectedShapesLocal : [...selectedShapesLocal, cur.dataset.id!])
    // ? selectedShapesLocal
    // : [cur.dataset.id!];

    const shapes: SVGSVGElement[] = selectedShapesLocal.map(shapeId => svgCanvas.current?.querySelector(`[data-id="${shapeId}"]`)!);
    cur.style.cursor = 'grabbing';
    // const shift = {
    //   x: (e.clientX / scale - cur.getBoundingClientRect().left / scale), // смещение позиции курсора от позиции элемента по x
    //   // y: (e.clientY / scale - cur.getBoundingClientRect().top / scale), // по y
    //   y: (e.clientY / scale - cur.getBoundingClientRect().top / scale), // по y
    // }
    const shifts = shapes.map(shape => ({
      x: (e.clientX / scale - shape.getBoundingClientRect().left / scale), // смещение позиции курсора от позиции элемента по x
      y: (e.clientY / scale - shape.getBoundingClientRect().top / scale), // по y
    }));
    // const shapeID = e.currentTarget.dataset.id!;
    let movableShapes: IShape[] = [];
    let oldShapes: IShape[] = [];
    let layerIDs: string[] = [];
    selectedShapesLocal.forEach(shapeId =>
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
      //   ({
      //     x: -((canvasConfig.canvasWidth - canvasConfig.offsetX * 2) / 2 - x),
      //     y: ((canvasConfig.canvasHeight - canvasConfig.offsetY * 2) / 2 - y)
      // })
      console.log({
        x: ((canvasConfig.canvasWidth - canvasConfig.offsetX * 2) / 2 + 300),
        y: ((canvasConfig.canvasHeight - canvasConfig.offsetY * 2) / 2 - 300)
      })
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
      // console.log(selectedShapes, selectedShapesLocal)
      wrapSelectedShapesInContour();
      svgSelect({ id: cur.dataset.id!, domRect: cur.getBBox() });
      // el.style.transform = `translate(${Math.trunc(toCoords.x - (shift?.x ?? 0)).toString()},${Math.trunc(toCoords.y - (shift?.y ?? 0)).toString()})`;
    }
    svgSelect({ id: cur.dataset.id!, domRect: cur.getBBox() });


    svgCanvas.current!.onmousemove = onMouseMove;
    svgCanvas.current!.onmouseup = () => {
      if (isMoved) {
        oldShapes.forEach((oldShape, i) => {
          const moveShapeAction = new ChangeGraphicalPropertyAction(oldShape, layerIDs[i], movableShapes[i].config.graphicalProperties);
          actionStore.push(moveShapeAction);
        })

        isMoved = false;
      }
      svgCanvas.current!.onmousemove = null;
      svgCanvas.current!.onmouseup = null;
      cur.style.cursor = 'auto';
      setSelectedShapes(selectedShapesLocal);
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

    pt.x = e.clientX;
    pt.y = e.clientY;
  }

  const transformOuterCoordsToSVGCoords = (coords: ICoords) => {
    // const svg = document.querySelector('#canvas svg') as SVGSVGElement;
    const g = svgCanvas.current!.querySelector('#elementsGroup') as SVGSVGElement; //document.querySelector('#canvas svg>g') as SVGSVGElement;
    //const NS = svgCanvas.getAttribute('xmlns');
    const pt = svgCanvas.current!.createSVGPoint();

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

  function svgSelect(e: React.PointerEvent<SVGGeometryElement> | React.FocusEvent<SVGGeometryElement>): void;
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
    // if (shiftIsPressed || (!shiftIsPressed && !selectedShapes.length)) {
    //   setSelectedShapes(prev => [...prev, curObj!.config.id!])
    // } else {
    //   setSelectedShapes([curObj!.config.id!]);
    // };
    // (shiftIsPressed || (!shiftIsPressed && !selectedShapes.length)) && setSelectedShapes(prev => [...prev, curObj!.config.id!]);
    // setSelectedShapes(prev => (shiftIsPressed ? (selectedShapes.includes(curObj!.config.id!) ? prev : [...prev, curObj!.config.id!]) : [curObj!.config.id!]));

    // const userCoords = toUserCoordSystem({ x: +curObj!.config.graphicalProperties.x.value, y: +curObj!.config.graphicalProperties.y.value });
    // const userCoords = toCartesianCoordSystem({
    //   x: +curObj!.config.graphicalProperties.x.value,
    //   y: +curObj!.config.graphicalProperties.y.value
    // }, canvasConfig);
    // const userCoords = {
    //   x: +curObj!.config.graphicalProperties.x.value,
    //   y: +curObj!.config.graphicalProperties.y.value
    // };
    const config: IShapeProps = {
      id: curObj!.config.id!,
      type: curObj!.type,
      graphProps: {
        ...curObj!.config.graphicalProperties,
        // x: { ...curObj!.config.graphicalProperties.x, value: curObj!.config.graphicalProperties.x.value },
        // y: { ...curObj!.config.graphicalProperties.y, value: curObj!.config.graphicalProperties.y.value }
        // x: { ...curObj!.config.graphicalProperties.x, value: userCoords.x.toString() },
        // y: { ...curObj!.config.graphicalProperties.y, value: userCoords.y.toString() }
      },
      objectProps: {
        ...curObj!.config.objectProperties,
      }
    }
    getClickedShapeConfigCallback(config);
  }

  const wrapSelectedShapesInContour = () => {
    const shapes = selectedShapes.map(id => svgCanvas.current?.querySelector(`[data-id="${id}"]`))
      .filter(i => i) as SVGElement[];
    //currentPage?.getLayers().flatMap(layer => layer.getShapes()).find(shape => shape.config.id === selectedShapes);

    if (shapes.length) {
      const coords = shapes.map(shape => {
        const clientRect = shape.getBoundingClientRect();
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
        isShow: true
      })
    }
  }

  const hideContour = (e: React.FocusEvent) => {
    !shiftIsPressed && !(e.relatedTarget?.getAttribute('role') === 'control') && setSelectedShapes([]);
    selectedShapes.length
      && (e.relatedTarget?.getAttribute('role') === 'shape')
      && !selectedShapes.includes((e.relatedTarget as SVGGeometryElement).dataset.id!)
      && setSelectedShapes([]);
    // console.log('lost');
    // console.log(shiftIsPressed && e.relatedTarget?.getAttribute('role') === 'shape')
    // shiftIsPressed && (e.relatedTarget?.getAttribute('role') === 'shape') && setSelectedShapes(prev => [...prev, (e.relatedTarget as SVGGeometryElement).dataset.id!])
    setControlsConfig({ ...controlsConfig, isShow: false });
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      e.shiftKey && setShiftIsPressed(true);
      document.onkeyup = (e: KeyboardEvent) => {
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

  useEffect(() => {
    if (selectedShapes.length) {
      wrapSelectedShapesInContour();
    } else {
      setControlsConfig({ ...controlsConfig, isShow: false });
    }
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

  const fitToBorder = (translatePoint: ICoords, scaleVal: number = scale) => {
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

  function toScale(nextScale: number, originPoint: ICoords = { x: window.innerWidth / 2, y: window.innerHeight / 2 }) {
    const divis = nextScale / scale;

    const translatePoint: ICoords = {
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
    setSelectedShapes([]);
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
      let translatePoint: ICoords = {
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

  enum ScaleControlType {
    LEFT_TOP = 'left-top',
    RIGHT_TOP = 'right-top',
    LEFT_BOTTOM = 'left-bottom',
    RIGHT_BOTTOM = 'right-bottom',
    TOP = 'top',
    RIGHT = 'right',
    BOTTOM = 'bottom',
    LEFT = 'left'
  }
  // const proportionalScaleControls = [ScaleControlType.LEFT_TOP, ScaleControlType.RIGHT_TOP, ScaleControlType.LEFT_BOTTOM, ScaleControlType.RIGHT_BOTTOM];
  interface IScaleControlConfig {
    increment: (shift: ICoords) => number,
    decrement: (shift: ICoords) => number,
    isIncrease: (shift: ICoords) => boolean,
    isDecrease: (shift: ICoords) => boolean,
    getCoords: (inititalCoords: ICoords, summand: number) => { x: number | null, y: number | null },
    setSize: (shape: IShape, initVals: { w: number, h: number }, summand: number) => boolean
  }

  interface IScaleControlHandlerConfig {
    [ScaleControlType.LEFT_TOP]: IScaleControlConfig,
    [ScaleControlType.RIGHT_TOP]: IScaleControlConfig,
    [ScaleControlType.RIGHT_BOTTOM]: IScaleControlConfig,
    [ScaleControlType.LEFT_BOTTOM]: IScaleControlConfig,
    [ScaleControlType.TOP]: IScaleControlConfig,
    [ScaleControlType.RIGHT]: IScaleControlConfig,
    [ScaleControlType.BOTTOM]: IScaleControlConfig,
    [ScaleControlType.LEFT]: IScaleControlConfig,
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
      }),
      setSize: (shape, initVals, summand) => {
        shape.overallWidth = initVals.w + summand;
        shape.overallHeight = initVals.h + summand;
        return true;
      }
    },
    [ScaleControlType.RIGHT_TOP]: {
      isIncrease: (shift) => shift.x > 0 || shift.y < 0,
      increment: (shift) => Math.max(shift.x, -shift.y),
      isDecrease: (shift) => shift.x < 0 && shift.y > 0,
      decrement: (shift) => Math.min(shift.x, shift.y),
      getCoords: (initialCoords, summand) => ({
        x: null,
        y: initialCoords.y - summand
      }),
      setSize: (shape, initVals, summand) => {
        shape.overallWidth = initVals.w + summand;
        shape.overallHeight = initVals.h + summand;
        return true;
      }
    },
    [ScaleControlType.RIGHT_BOTTOM]: {
      isIncrease: (shift) => shift.x > 0 || shift.y > 0,
      increment: (shift) => Math.max(shift.x, shift.y),
      isDecrease: (shift) => shift.x < 0 && shift.y < 0,
      decrement: (shift) => Math.min(shift.x, -shift.y),
      getCoords: (initialCoords, summand) => ({
        x: null,
        y: null
      }),
      setSize: (shape, initVals, summand) => {
        shape.overallWidth = initVals.w + summand;
        shape.overallHeight = initVals.h + summand;
        return true;
      }
    },
    [ScaleControlType.LEFT_BOTTOM]: {
      isIncrease: (shift) => shift.x < 0 || shift.y > 0,
      increment: (shift) => Math.max(-shift.x, shift.y),
      isDecrease: (shift) => shift.x > 0 && shift.y < 0,
      decrement: (shift) => Math.min(shift.x, shift.y),
      getCoords: (initialCoords, summand) => ({
        x: initialCoords.x - summand,
        y: null
      }),
      setSize: (shape, initVals, summand) => {
        shape.overallWidth = initVals.w + summand;
        shape.overallHeight = initVals.h + summand;
        return true;
      }
    },
    [ScaleControlType.TOP]: {
      isIncrease: (shift) => shift.y < 0,
      increment: (shift) => -shift.y,
      isDecrease: (shift) => shift.y > 0,
      decrement: (shift) => -shift.y,
      getCoords: (initialCoords, summand) => ({
        x: null,
        y: initialCoords.y - summand
      }),
      setSize: (shape, initVals, summand) => {
        shape.overallHeight = initVals.h + summand;
        return true;
      }
    },
    [ScaleControlType.RIGHT]: {
      isIncrease: (shift) => shift.x > 0,
      increment: (shift) => shift.x,
      isDecrease: (shift) => shift.x < 0,
      decrement: (shift) => shift.x,
      getCoords: (initialCoords, summand) => ({
        x: null,
        y: null
      }),
      setSize: (shape, initVals, summand) => {
        shape.overallWidth = initVals.w + summand;
        return true;
      }
    },
    [ScaleControlType.BOTTOM]: {
      isIncrease: (shift) => shift.y > 0,
      increment: (shift) => shift.y,
      isDecrease: (shift) => shift.y < 0,
      decrement: (shift) => shift.y,
      getCoords: (initialCoords, summand) => ({
        x: null,
        y: null
      }),
      setSize: (shape, initVals, summand) => {
        shape.overallHeight = initVals.h + summand
        return true;
      }
    },
    [ScaleControlType.LEFT]: {
      isIncrease: (shift) => shift.x < 0,
      increment: (shift) => -shift.x,
      isDecrease: (shift) => shift.x > 0,
      decrement: (shift) => -shift.x,
      getCoords: (initialCoords, summand) => ({
        x: initialCoords.x - summand,
        y: null
      }),
      setSize: (shape, initVals, summand) => {
        shape.overallWidth = initVals.w + summand
        return true;
      }
    }
  }

  const scaleControlHandler = (e: React.PointerEvent, type: ScaleControlType) => {
    const inititalPoint = transformOuterCoordsToSVGCoords({ x: e.pageX, y: e.pageY });
    const shapes = selectedShapes.map(id => currentPage!.getLayers().flatMap(layer => layer.getShapes()).find(shape => shape.config.id === id));
    const initialSizes = shapes.map(shape => ({
      w: shape!.overallWidth!,
      h: shape!.overallHeight!
    }));
    const initialCoords = shapes.map(shape => ({
      x: +shape!.config.graphicalProperties.x.value,
      y: +shape!.config.graphicalProperties.y.value
    }));
    svgCanvas.current!.onpointermove = (e: PointerEvent) => {
      const currentPoint = transformOuterCoordsToSVGCoords({ x: e.pageX, y: e.pageY });
      const shift = {
        x: currentPoint.x - inititalPoint.x,
        y: currentPoint.y - inititalPoint.y
      };
      shapes.forEach((shape, i) => {
        let newCoords: { x: number | null, y: number | null } = { x: null, y: null };
        if (scaleControlsHandlerConfig[type].isIncrease(shift)) {
          const increment = scaleControlsHandlerConfig[type].increment(shift);
          if (!scaleControlsHandlerConfig[type].setSize(shape!, initialSizes[i], increment)) { return };
          newCoords = scaleControlsHandlerConfig[type].getCoords(initialCoords[i], increment);
        }
        if (scaleControlsHandlerConfig[type].isDecrease(shift)) {
          const decrement = scaleControlsHandlerConfig[type].decrement(shift);
          if (!scaleControlsHandlerConfig[type].setSize(shape!, initialSizes[i], decrement)) { return }
          newCoords = scaleControlsHandlerConfig[type].getCoords(initialCoords[i], decrement);
        }
        newCoords.x && (shape!.config.graphicalProperties.x.value = newCoords.x.toString());
        newCoords.y && (shape!.config.graphicalProperties.y.value = newCoords.y.toString());
      });
      // setControlsConfig({
      //   ...controlsConfig,
      //   x: +shapes.at(-1)!.config.graphicalProperties.x.value - controlsConfig.offset,
      //   y: +shapes.at(-1)!.config.graphicalProperties.y.value - controlsConfig.offset,
      //   w: shapes.at(-1)!.overallWidth! + controlsConfig.offset * 2,
      //   h: shapes.at(-1)!.overallHeight! + controlsConfig.offset * 2
      // });
      wrapSelectedShapesInContour();
      const config: IShapeProps = {
        id: shapes.at(-1)!.config.id!,
        type: shapes.at(-1)!.type,
        graphProps: {
          ...shapes.at(-1)!.config.graphicalProperties
        },
        objectProps: {
          ...shapes.at(-1)!.config.objectProperties,
        }
      }
      getClickedShapeConfigCallback(config);
    }
    svgCanvas.current!.onpointerup = (e: PointerEvent) => {
      svgCanvas.current!.onpointermove = null;
      svgCanvas.current!.onpointerup = null;
      shapes.map(shape => {
        const newProps = shape!.config.graphicalProperties;
        const currentLayer = currentPage?.getLayers().find(layer => layer.getShapes().some(curShape => curShape === shape!));
        if (currentLayer && shape) {
          const changePropAction = new ChangeGraphicalPropertyAction(
            shape!,
            currentLayer.getID(),
            newProps,
          );
          actionStore.push(changePropAction);
        }
      });
    }
  }

  function toDegrees(val: number) {
    return (val < 0) ? (180 - Math.abs(val) + 180) : val
  }
  const rotateControlHandler = (e: React.PointerEvent) => {
    const shapes = selectedShapes
      .map(id => currentPage!.getLayers().flatMap(layer => layer.getShapes()).find(shape => shape.config.id === id));
    const centerCoords = {
      x: controlsConfig.x + controlsConfig.w / 2,
      y: controlsConfig.y + controlsConfig.h / 2
    };
    const initRotationAngles = shapes.map(shape => +shape!.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value);
    const initCoords = shapes.map(shape => ({
      x: +shape!.config.graphicalProperties[GraphicalPropertyTypes.X].value + shape!.overallWidth! / 2,
      y: +shape!.config.graphicalProperties[GraphicalPropertyTypes.Y].value + shape!.overallHeight! / 2
    }));
    const initCursor = transformOuterCoordsToSVGCoords({ x: e.clientX, y: e.clientY });
    svgCanvas.current!.onpointermove = (e: PointerEvent) => {
      const cursor = transformOuterCoordsToSVGCoords({ x: e.clientX, y: e.clientY });
      const rotationAngle = Math.atan2(cursor.x - centerCoords.x, -(cursor.y - centerCoords.y)) * (180 / Math.PI);
      // const angles = initRotationAngles.map(initAngle => Math.atan2(cursor.x - centerCoords.x, -(cursor.y - centerCoords.y)) * (180 / Math.PI) + initAngle);
      shapes.forEach((shape, i) => {
        // shape!.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value = angles[i].toString();
        shape!.config.graphicalProperties[GraphicalPropertyTypes.PIVOT].value = (initRotationAngles[i] + rotationAngle
          * parseInt(shape!.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_X].value.toString())
          * parseInt(shape!.config.graphicalProperties[GraphicalPropertyTypes.MIRROR_Y].value.toString())).toString();

        if (shapes.length > 1) {
          const initTranslateAngle = Math.atan2(centerCoords.y - initCoords[i].y, centerCoords.x - initCoords[i].x)
            + Math.atan2(centerCoords.y - initCursor.y, centerCoords.x - initCursor.x);
          const translateAngle = initTranslateAngle + Math.atan2(centerCoords.y - cursor.y, centerCoords.x - cursor.x);
          const radius = Math.sqrt(Math.pow(Math.abs(centerCoords.x - initCoords[i].x), 2) + Math.pow(Math.abs(centerCoords.y - initCoords[i].y), 2));

          const newCoords = {
            x: radius * Math.cos(translateAngle) + centerCoords.x - shape!.overallWidth! / 2,
            y: radius * Math.sin(translateAngle) + centerCoords.y - shape!.overallHeight! / 2
          };
          shape!.config.graphicalProperties[GraphicalPropertyTypes.X].value = (newCoords.x).toString();
          shape!.config.graphicalProperties[GraphicalPropertyTypes.Y].value = (newCoords.y).toString();
        }
      })
      const config: IShapeProps = {
        id: shapes.at(-1)!.config.id!,
        type: shapes.at(-1)!.type,
        graphProps: {
          ...shapes.at(-1)!.config.graphicalProperties,
        },
        objectProps: {
          ...shapes.at(-1)!.config.objectProperties,
        }
      };
      // wrapSelectedShapesInContour();
      getClickedShapeConfigCallback(config);
    }
    svgCanvas.current!.onpointerup = (e: PointerEvent) => {
      svgCanvas.current!.onpointermove = null;
      svgCanvas.current!.onpointerup = null;
      wrapSelectedShapesInContour();
      shapes.forEach(shape => {
        const newProps = shape!.config.graphicalProperties;
        const currentLayer = currentPage?.getLayers().find(layer => layer.getShapes().some(curShape => curShape === shape!));
        if (currentLayer && shape) {
          const changePropAction = new ChangeGraphicalPropertyAction(
            shape!,
            currentLayer.getID(),
            newProps,
          );
          actionStore.push(changePropAction);
        }
      })
      // controlsConfig.rotateDeg = 0;
    }
  }


  const [startConnectionElement, setStartConnectionElement] = useState<{ shape: string, point: string } | null>(null);
  const connectionStartHandler = (/*e: React.PointerEvent,*/ shapeId: string, point: IConnectionPoint) => {
    const shape = currentPage?.getLayers().flatMap(layer => layer.getShapes()).find(shape => shape.config.id === shapeId);

    setStartConnectionElement({
      shape: shape?.config.id!,
      point: point.id
    });

    svgCanvas.current!.onpointerdown = (e: PointerEvent) => {
      if ((e.target as SVGAElement).getAttribute('role') !== 'connection-area') {
        setStartConnectionElement(null);
      }
    }
  };

  const connectionEndHandler = (shapeId: string, point: IConnectionPoint) => {
    const firstShapeId = startConnectionElement!.shape;
    const secondShapeId = shapeId;
    const firstShape = currentPage?.getLayers().flatMap(layer => layer.getShapes()).find(shape => shape.config.id === startConnectionElement!.shape);
    const secondShape = currentPage?.getLayers().flatMap(layer => layer.getShapes()).find(shape => shape.config.id === shapeId);

    const firstShapeConnectionPoints: IConnectionPoint[] = firstShape!.config.connectionPoints!
      .map((p) => p.id === startConnectionElement?.point
        ? { ...p, connectedShapes: [...(p.connectedShapes ?? []), { shapeId: secondShapeId!, pointId: point.id }] }
        : p
      );

    const secondShapeConnectionPoints: IConnectionPoint[] = secondShape!.config.connectionPoints!
      .map((p) => p.id === point.id
        ? { ...p, connectedShapes: [...(p.connectedShapes ?? []), { shapeId: firstShapeId!, pointId: startConnectionElement!.point }] }
        : p
      );

    const changeConnectionPointsAction = new ChangeConnectionPointsAction(
      firstShape!,
      secondShape!,
      firstShapeConnectionPoints,
      secondShapeConnectionPoints
    );
    actionStore.push(changeConnectionPointsAction);

    setStartConnectionElement(null);
  };

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
          <g style={{ transform: `matrix(${scale}, 0, 0, ${scale}, ${translate.x}, ${translate.y}) ` }}>
            <use href="#gridRect" />
            <svg
              width={canvasConfig.canvasWidth - canvasConfig.offsetX * 2}
              height={canvasConfig.canvasHeight - canvasConfig.offsetY * 2}
            // viewBox={`${(canvasConfig.canvasWidth - canvasConfig.offsetX * 2) / 2} ${(canvasConfig.canvasHeight - canvasConfig.offsetY * 2) / 2} ${canvasConfig.canvasWidth - canvasConfig.offsetX * 2} ${canvasConfig.canvasHeight - canvasConfig.offsetY * 2}`}
            >
              <filter id="outlineFilter">
                <feMorphology
                  in="SourceGraphic"
                  result="dilate-result"
                  operator="dilate"
                  radius="1"
                />
                <feComposite
                  in="SourceGraphic"
                  in2="dilate-result"
                  result="xor-result"
                  operator="xor"
                />
              </filter>
              <g id="elementsGroup"
              // style={{
              // outline: '2px solid #000000',
              // transform: `translate(-300, -3000)`,
              // transformOrigin: 'center
              // }}
              >
                {(() => {
                  const connections: Connection[] = [];
                  const shapes: IShape[] = currentPage!.getLayers().flatMap((layer: ILayer) => layer.getShapes());
                  const connectedShapes: [string, string][] = [];
                  shapes.forEach((s: IShape) => {
                    s.config.connectionPoints?.forEach(((p: IConnectionPoint) => {
                      if (!p.connectedShapes) return;
                      const startCoords: ICoords = {
                        x: +s.config.graphicalProperties[GraphicalPropertyTypes.X].value + p.relativeCoords.x,
                        y: +s.config.graphicalProperties[GraphicalPropertyTypes.Y].value + p.relativeCoords.y
                      };
                      p.connectedShapes.forEach(({ shapeId, pointId }) => {
                        const s2 = shapes.find(s => s.config.id === shapeId);
                        if (s2) {
                          const p2 = s2.config.connectionPoints?.find(p => p.id === pointId);
                          if (!p2) return;
                          const endCoords: ICoords = {
                            x: +s2.config.graphicalProperties[GraphicalPropertyTypes.X].value + p2.relativeCoords.x,
                            y: +s2.config.graphicalProperties[GraphicalPropertyTypes.Y].value + p2.relativeCoords.y
                          };
                          // console.log('first', startCoords, 'second', endCoords);
                          if (!connectedShapes.some(tuple => tuple[0] === p2.id && tuple[1] === p.id)) {
                            connections.push(new Connection(startCoords, endCoords));
                            connectedShapes.push([p.id, p2.id]);
                          }
                        }
                      })
                    }));
                  });
                  // console.log(connections)
                  return connections.map((c: Connection) => c.render());
                })()}
                {currentPage?.getLayers().map((layer: ILayer) => layer.getShapes().map(s => {
                  return <g id={`shape-${s.config.id}`}>
                    {s.render(
                      svgDragNDrop,
                      hideContour,
                      layer.getZIndex(),
                      selectedShapes.includes(s.config.id!) && layer.getID() === project?.getCurrentPage().getCurrentLayer().getID(),
                    )}
                    {((selectedShapes.includes(s.config.id!) && selectedShapes.length === 1)
                      || (startConnectionElement && startConnectionElement?.shape !== s.config.id))
                      && <g id='connectionControls' transform={`translate(${s.config.graphicalProperties[GraphicalPropertyTypes.X].value},${s.config.graphicalProperties[GraphicalPropertyTypes.Y].value})`}>
                        {s.config.connectionPoints?.map(point => {
                          return <g>
                            {startConnectionElement && <circle role='connection-area' r={point.connectionAreaRadius}
                              transform={`translate(${point.relativeCoords.x + point.markerOffset.x},${point.relativeCoords.y + point.markerOffset.y})`}
                              onPointerDown={() => startConnectionElement && connectionEndHandler(s.config.id!, point)}
                            />}
                            <circle role='connection' data-connection={point.type} r="5" tabIndex={-1}
                              transform={`translate(${point.relativeCoords.x + point.markerOffset.x},${point.relativeCoords.y + point.markerOffset.y})`}
                              onPointerDown={() => connectionStartHandler(s.config.id!, point)}
                            />
                          </g>
                        })}
                      </g>}
                  </g>
                }))}
                {cursorAnimations.map(a => <animated.path
                  d={`M${a.cx.get()} ${a.cy.get()} l32 12 l-15 5 l-4 16Z`}
                  fill={a.fill} stroke="#5B5959" strokeWidth="2">
                  <title>{usersStore.getData().find(u => u.id === a.userId.get())?.name}</title>
                </animated.path>)}
                {controlsConfig.isShow && <g id='controls' transform={`translate(${controlsConfig.x},${controlsConfig.y})`}>
                  <g id='selectionContour'>
                    <line x1={0} x2={controlsConfig.w} y1={0} y2={0} />
                    <line x1={controlsConfig.w} x2={controlsConfig.w} y1={0} y2={controlsConfig.h} />
                    <line x1={controlsConfig.w} x2={0} y1={controlsConfig.h} y2={controlsConfig.h} />
                    <line x1={0} x2={0} y1={controlsConfig.h} y2={0} />
                    <circle r="1" cx={controlsConfig.w / 2} cy={controlsConfig.h / 2} tabIndex={-1} />
                  </g>
                  {selectedShapes.length && <>
                    <g id='scaleControls'>
                      <line x1={0} x2={controlsConfig.w} y1={0} y2={0} stroke='transparent'
                        role='control' data-control='top' tabIndex={-1}
                        onPointerDown={e => scaleControlHandler(e, ScaleControlType.TOP)}
                        onBlur={hideContour} />
                      <line x1={controlsConfig.w} x2={controlsConfig.w} y1={0} y2={controlsConfig.h} stroke='transparent'
                        role='control' data-control='right' tabIndex={-1}
                        onPointerDown={e => scaleControlHandler(e, ScaleControlType.RIGHT)}
                        onBlur={hideContour} />
                      <line x1={controlsConfig.w} x2={0} y1={controlsConfig.h} y2={controlsConfig.h} stroke='transparent'
                        role='control' data-control='bottom' tabIndex={-1}
                        onPointerDown={e => scaleControlHandler(e, ScaleControlType.BOTTOM)}
                        onBlur={hideContour} />
                      <line x1={0} x2={0} y1={controlsConfig.h} y2={0} stroke='transparent'
                        role='control' data-control='left' tabIndex={-1}
                        onPointerDown={e => scaleControlHandler(e, ScaleControlType.LEFT)}
                        onBlur={hideContour} />
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
                    </g>
                    <g id='rotateControl'
                      transform={`translate(${controlsConfig.w / 2 - 10},-24)`}
                      onBlur={hideContour}>
                      <path
                        role='control'
                        data-control='rotate'
                        tabIndex={-1}
                        onPointerDown={rotateControlHandler}
                        d="M15.7733 13.3292C15.4851 14.1471 14.9388 14.8493 14.2169 15.3298C13.4949 15.8103 12.6363 16.0432 11.7704 15.9934C10.9046 15.9436 10.0784 15.6137 9.41631 15.0535C8.75424 14.4933 8.29217 13.7332 8.09972 12.8876C7.90728 12.042 7.99489 11.1567 8.34934 10.3652C8.7038 9.57374 9.3059 8.91887 10.0649 8.4993C10.824 8.07974 11.6988 7.91819 12.5576 8.03902C13.9223 8.23101 14.9173 9.23345 16 10M16 10V7M16 10H13" />
                      <line x1={12} x2={12} y1={16} y2={24} strokeWidth={1} />
                    </g>
                  </>}
                </g>}
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
        numberInputMax={9999}
        onChange={(val: string) => toScale(parseFloat((parseInt(val) * 0.01).toFixed(1)))} />
    </>
  )
})

export default SVGCanvas;