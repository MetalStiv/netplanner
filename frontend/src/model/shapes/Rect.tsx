import IShape, { IShapeProps } from "./IShape";
import Shapes from "./Shapes";

interface RectProps extends IShapeProps {
    sizes: {
        w: number,
        h: number,
    },
    rDif?: {
        rx: number,
        ry: number
    },
    stroke?: string,
    fill?: string,
    pathLength?: number,
}

class Rect implements IShape {
    elemProps: RectProps;

    constructor(obj: RectProps) {
        this.elemProps = obj;
        this.elemProps.type = Shapes.Rect;
    }

    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void, handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void) {
        return <path
            id={this.elemProps.id}
            key={this.elemProps.id}
            data-type={this.elemProps.type}
            stroke={this.elemProps.stroke ?? 'black'}
            fill={this.elemProps.fill ?? 'black'}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={`M${this.elemProps.startCoords?.x} ${this.elemProps.startCoords?.y} 
            h ${this.elemProps.sizes?.w ?? 15}
            v ${this.elemProps.sizes?.h ?? 10}
            h -${this.elemProps.sizes?.w ?? 15}
            Z`}
        />
        //return <rect id={this.elemProps.id} key={this.elemProps.id} x={this.elemProps.startCoords?.x} y={this.elemProps.startCoords?.y} width={this.elemProps.sizes?.w ?? 15} height={this.elemProps.sizes?.h ?? 10} rx={this.elemProps.rDif?.rx ?? 0} ry={this.elemProps.rDif?.ry ?? 0} pathLength={this.elemProps.pathLength ?? ''} stroke={this.elemProps.stroke ?? 'black'} fill={this.elemProps.fill ?? 'black'} onDragStart={(e) => e.preventDefault} onMouseDown={handlerMouseDown} />;
    }
}


export default Rect;