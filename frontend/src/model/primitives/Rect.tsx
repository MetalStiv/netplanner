import IShape, { IShapeGraphicalProps, IShapeProps } from "../IShape";
import IShapeCreator from "../IShapeCreator";

interface IRectGraphicalProps extends IShapeGraphicalProps {
    sizes: { w: number, h: number, },
}

interface IRectProps extends IShapeProps {
    graphical: IRectGraphicalProps
    rDif?: {
        rx: number,
        ry: number
    },
    stroke?: string,
    fill?: string,
    pathLength?: number,
}

export class RectCreator implements IShapeCreator {
    type: string = 'Rectangle';
    create() {
        return new Rect({
            graphical: {
                startCoords: {
                    x: 0,
                    y: 0
                },
                sizes: {
                    w: 15,
                    h: 10,
                }
            },
        });
    }
}

class Rect implements IShape {
    type: string = 'Rectangle';
    config: IRectProps;

    genID = (len: number) => {
        return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(len).toString().replace('.', ''));
    }

    constructor(obj: IRectProps) {
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
            d={
                `M${this.config.graphical.startCoords?.x} ${this.config.graphical.startCoords?.y} 
                h ${this.config.graphical.sizes?.w ?? 15}
                v ${this.config.graphical.sizes?.h ?? 10}
                h -${this.config.graphical.sizes?.w ?? 15}
                Z`
            }
        />
        //return <rect id={this.elemProps.id} key={this.elemProps.id} x={this.elemProps.startCoords?.x} y={this.elemProps.startCoords?.y} width={this.elemProps.sizes?.w ?? 15} height={this.elemProps.sizes?.h ?? 10} rx={this.elemProps.rDif?.rx ?? 0} ry={this.elemProps.rDif?.ry ?? 0} pathLength={this.elemProps.pathLength ?? ''} stroke={this.elemProps.stroke ?? 'black'} fill={this.elemProps.fill ?? 'black'} onDragStart={(e) => e.preventDefault} onMouseDown={handlerMouseDown} />;
    }
}


export default Rect;