import React, { useState } from 'react';
//import { useRootStore } from '../providers/rootProvider';
import { Collapse } from 'react-collapse';

const ShapesPanel: React.FC = () => {
    //const userStore = useRootStore()?.getUserStore()

    const [collapsePanel1IsOpen, setCollapsePanel1IsOpen] = useState<boolean>(false);
    const [collapsePanel2IsOpen, setCollapsePanel2IsOpen] = useState<boolean>(false);
    const [collapsePanel3IsOpen, setCollapsePanel3IsOpen] = useState<boolean>(false);
    const [collapsePanel4IsOpen, setCollapsePanel4IsOpen] = useState<boolean>(false);
    const [collapsePanel5IsOpen, setCollapsePanel5IsOpen] = useState<boolean>(false);

    return (
        <div id="shapesPanel">
            <p className="panel-title">Shapes</p>
            <div className="collapse-panel" data-hidden={!collapsePanel1IsOpen}>
                <p aria-expanded={collapsePanel1IsOpen} onClick={() => setCollapsePanel1IsOpen(!collapsePanel1IsOpen)} className="collapsedPanel-head btn">Primitives</p>
                <Collapse isOpened={collapsePanel1IsOpen}>
                    <div>
                        <p className='collapseItem'>Точка</p>
                        <p className='collapseItem'>Линия</p>
                        <p className='collapseItem'>Круг</p>
                        <p className='collapseItem'>Эллипс</p>
                        <p className='collapseItem'>Полилиния</p>
                        <p className='collapseItem'>Прямоугольник</p>
                    </div>
                </Collapse>
            </div>
            <div className="collapse-panel" data-hidden={!collapsePanel2IsOpen}>
                <p aria-expanded={collapsePanel2IsOpen} onClick={() => setCollapsePanel2IsOpen(!collapsePanel2IsOpen)} className="collapsedPanel-head btn">Primitives</p>
                <Collapse isOpened={collapsePanel2IsOpen}>
                    <div>
                        <p className='collapseItem'>Точка</p>
                        <p className='collapseItem'>Линия</p>
                        <p className='collapseItem'>Круг</p>
                        <p className='collapseItem'>Эллипс</p>
                        <p className='collapseItem'>Полилиния</p>
                        <p className='collapseItem'>Прямоугольник</p>
                    </div>
                </Collapse>
            </div>
            <div className="collapse-panel" data-hidden={!collapsePanel3IsOpen}>
                <p aria-expanded={collapsePanel3IsOpen} onClick={() => setCollapsePanel3IsOpen(!collapsePanel3IsOpen)} className="collapsedPanel-head btn">Primitives</p>
                <Collapse isOpened={collapsePanel3IsOpen}>
                    <div>
                        <p className='collapseItem'>Точка</p>
                        <p className='collapseItem'>Линия</p>
                        <p className='collapseItem'>Круг</p>
                        <p className='collapseItem'>Эллипс</p>
                        <p className='collapseItem'>Полилиния</p>
                        <p className='collapseItem'>Прямоугольник</p>
                    </div>
                </Collapse>
            </div>
            <div className="collapse-panel" data-hidden={!collapsePanel4IsOpen}>
                <p aria-expanded={collapsePanel4IsOpen} onClick={() => setCollapsePanel4IsOpen(!collapsePanel4IsOpen)} className="collapsedPanel-head btn">Primitives</p>
                <Collapse isOpened={collapsePanel4IsOpen}>
                    <div>
                        <p className='collapseItem'>Точка</p>
                        <p className='collapseItem'>Линия</p>
                        <p className='collapseItem'>Круг</p>
                        <p className='collapseItem'>Эллипс</p>
                        <p className='collapseItem'>Полилиния</p>
                        <p className='collapseItem'>Прямоугольник</p>
                    </div>
                </Collapse>
            </div>
            <div className="collapse-panel" data-hidden={!collapsePanel5IsOpen}>
                <p aria-expanded={collapsePanel5IsOpen} onClick={() => setCollapsePanel5IsOpen(!collapsePanel5IsOpen)} className="collapsedPanel-head btn">Primitives</p>
                <Collapse isOpened={collapsePanel5IsOpen}>
                    <div>
                        <p className='collapseItem'>Точка</p>
                        <p className='collapseItem'>Линия</p>
                        <p className='collapseItem'>Круг</p>
                        <p className='collapseItem'>Эллипс</p>
                        <p className='collapseItem'>Полилиния</p>
                        <p className='collapseItem'>Прямоугольник</p>
                    </div>
                </Collapse>
            </div>
        </div>
    )
}

export default ShapesPanel;