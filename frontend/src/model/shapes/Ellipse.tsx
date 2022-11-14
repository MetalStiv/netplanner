import IShape, { IShapeProps } from "./IShape";
import Shapes from "./Shapes";

interface EllipseProps extends IShapeProps {
    r?: number
    rDif: {
        rx: number,
        ry: number
    }
    stroke?: string,
    fill?: string,
    pathLength?: number,
}

class Ellipse implements IShape {
    elemProps: EllipseProps;

    constructor(obj: EllipseProps) {
        this.elemProps = obj;
        this.elemProps.type = Shapes.Ellipse;
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
            d={`
            M ${this.elemProps.startCoords.x + this.elemProps.rDif.rx},${this.elemProps.startCoords.y}
            a ${this.elemProps.rDif.rx},${this.elemProps.rDif.ry}
            0
            1,0
            1,0
            z
            `}
        />
        // M - левая координата
        // первая в а - размеры по x,y
        // угол поворота
        // флаги
        // последняя - правая координата


        //return <ellipse id={this.elemProps.id} key={this.elemProps.id} cx={this.elemProps.startCoords.x + this.elemProps.rDif.rx} cy={this.elemProps.startCoords.y + this.elemProps.rDif.ry} r={this.elemProps.r ?? 10} rx={this.elemProps.rDif?.rx ?? 0} ry={this.elemProps.rDif?.ry ?? 0} pathLength={this.elemProps.pathLength} stroke={this.elemProps.stroke ?? 'black'} fill={this.elemProps.fill ?? 'black'} onDragStart={(e) => e.preventDefault} onMouseDown={handlerMouseDown} />;
    }
}


export default Ellipse;