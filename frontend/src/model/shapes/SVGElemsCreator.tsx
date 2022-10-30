import IShape from "./IShape";
import Shapes from "./Shapes"

class SVGElemsCreator {
    type: Shapes;
    initObj: IShape;

    constructor(type: Shapes, obj: IShape) {
        this.type = type;
        this.initObj = obj;
    }

    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void, handlerMouseUp: (e: React.MouseEvent<SVGGeometryElement>) => void) {
        let JSXElem;
        switch (this.type) {
            case Shapes.Rect: {
                JSXElem = <rect id={this.initObj.id} key={this.initObj.id} x={this.initObj.coord?.x} y={this.initObj.coord?.y} width={this.initObj.sizes?.w ?? 15} height={this.initObj.sizes?.h ?? 10} rx={this.initObj.rDif?.rx ?? 0} ry={this.initObj.rDif?.ry ?? 0} pathLength={this.initObj.pathLength ?? ''} stroke={this.initObj.stroke ?? 'black'} fill={this.initObj.fill ?? 'black'} onDragStart={(e) => e.preventDefault} onMouseDown={handlerMouseDown} onMouseUp={handlerMouseUp} />
                break;
            }
            case Shapes.Circle: {
                JSXElem = <circle id={this.initObj.id} key={this.initObj.id} cx={this.initObj.coord?.x} cy={this.initObj.coord?.y} r={this.initObj.r} pathLength={this.initObj.pathLength} stroke={this.initObj.stroke} fill={this.initObj.fill} />
                break;
            }
            case Shapes.Ellipse: {
                JSXElem = <ellipse id={this.initObj.id} key={this.initObj.id} cx={this.initObj.coord?.x} cy={this.initObj.coord?.y} rx={this.initObj.rDif?.rx} ry={this.initObj.rDif?.ry} pathLength={this.initObj.pathLength ?? ''} stroke={this.initObj.stroke ?? 'black'} fill={this.initObj.fill ?? 'black'} />
                break;
            }
            case Shapes.Line: {
                JSXElem = <line id={this.initObj.id} key={this.initObj.id} x1={this.initObj.startCoord?.x1} y1={this.initObj.startCoord?.y1} x2={this.initObj.endCoord?.x2} y2={this.initObj.endCoord?.y2} pathLength={this.initObj.pathLength} stroke={this.initObj.stroke ?? 'black'} />
                break;
            }
            case Shapes.Polyline: {
                JSXElem = <polyline id={this.initObj.id} key={this.initObj.id} points={this.initObj.points?.join(' ')} pathLength={this.initObj.pathLength} stroke={this.initObj.stroke ?? 'black'} fill={this.initObj.fill ?? 'none'} />
                break;
            }
            case Shapes.Point: {
                JSXElem = <circle id={this.initObj.id} key={this.initObj.id} cx={this.initObj.coord?.x} cy={this.initObj.coord?.y} r={this.initObj.r ?? 1} pathLength={this.initObj.pathLength} stroke={this.initObj.stroke} fill={this.initObj.fill} />
                break;
            }
            default: {
                JSXElem = <circle id={this.initObj.id} key={this.initObj.id} cx={this.initObj.coord?.x} cy={this.initObj.coord?.y} r={this.initObj.r} pathLength={this.initObj.pathLength} stroke={this.initObj.stroke} fill={this.initObj.fill} />
                break;
            }
        }
        return JSXElem;
    }


}


export default SVGElemsCreator;