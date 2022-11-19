import IShape, { IShapeGraphicalProps, IShapeProps } from "../IShape";
import IShapeCreator from "../IShapeCreator";

interface IEllipseGraphicalProps extends IShapeGraphicalProps {
    rDif: {
        rx: number,
        ry: number,
    }
}

interface IEllipseProps extends IShapeProps {
    graphical: IEllipseGraphicalProps,
    stroke?: string,
    fill?: string,
    pathLength?: number,
}

export class EllipseCreator implements IShapeCreator {
    type: string = 'Ellipse';
    create() {
        return new Ellipse({
            graphical: {
                startCoords: {
                    x: 0,
                    y: 0
                },
                rDif: {
                    rx: 30,
                    ry: 20,
                },
            },
        });
    }
}

class Ellipse implements IShape {
    type: string = 'Ellipse';
    config: IEllipseProps;

    private genID = (len: number) => {
        return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(len).toString().replace('.', ''));
    }

    constructor(obj: IEllipseProps) {
        this.config = obj;
        this.config.id = `${this.type}-${this.genID(10)}`;
    }

    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void, 
        handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void) {
        return <path
            id={this.config.id}
            key={this.config.id}
            data-type={this.type}
            stroke={this.config.stroke ?? 'black'}
            fill={this.config.fill ?? 'black'}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={`
                M ${this.config.graphical.startCoords.x + 
                    this.config.graphical.rDif.rx},${this.config.graphical.startCoords.y}
                a ${this.config.graphical.rDif.rx},${this.config.graphical.rDif.ry}
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