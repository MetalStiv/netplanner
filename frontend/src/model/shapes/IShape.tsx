interface IShape {
    id: string,
    coord: { x: number, y: number },
    sizes?: { w: number, h: number },
    r?: number,
    rDif?: { rx: number, ry: number },
    startCoord?: { x1: number, y1: number },
    endCoord?: { x2: number, y2: number },
    points?: Array<[number, number]>,
    stroke?: string,
    fill?: string,
    pathLength?: number,
}

export default IShape;