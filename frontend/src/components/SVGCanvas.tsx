import React, { ReactNode, useState, useEffect, LegacyRef } from 'react';
import SVGElemsCreator from '../model/shapes/SVGElemsCreator';
import { useRootStore } from '../providers/rootProvider';

interface SVGCanvasProps {
    width: number,
    height: number,
    objects: Array<SVGElemsCreator>,
    onClickHandler?: (e: React.MouseEvent<SVGElement>) => void,
    onMouseMoveHandler: (e: React.MouseEvent<SVGElement>) => void,
    onMouseDownHandler: (e: React.MouseEvent<SVGGeometryElement>) => void,
    onMouseUpHandler: (e: React.MouseEvent<SVGGeometryElement>) => void,
}

const SVGCanvas = ({ width, height, objects, onClickHandler, onMouseMoveHandler, onMouseDownHandler, onMouseUpHandler }: SVGCanvasProps) => {
    const userStore = useRootStore()?.getUserStore()

    return (
        <div className="canvas">
            <svg viewBox={`0 0 ${width} ${height}`} onClick={onClickHandler} onMouseMove={onMouseMoveHandler} xmlns="http://www.w3.org/2000/svg">
                {objects.map((el: SVGElemsCreator) => el.render(onMouseDownHandler, onMouseUpHandler))}
            </svg>
        </div>
    )
}

export default SVGCanvas;