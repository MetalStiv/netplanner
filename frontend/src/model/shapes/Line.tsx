import IShape, { IGraphProp, IShapeGraphicalProps, IShapeProps } from "../IShape";
import IShapeCreator from "../IShapeCreator";
import genID from "../../common/helpers/genID";
import { ShapeType } from "../ShapeType";

interface ILineGraphicalProps extends IShapeGraphicalProps {
    //endCoords: { x: number, y: number },
    endXCoord: IGraphProp,
    endYCoord: IGraphProp,
    //pathLength?: IGraphProp,
    stroke?: IGraphProp,
    fill?: IGraphProp,
}

interface ILineProps extends IShapeProps {
    graphical: ILineGraphicalProps,
    zIndex: number,
}

export class LineCreator implements IShapeCreator {
    type: ShapeType = ShapeType.LINE;
    create() {
        return new Line({
            graphical: {
                x: {
                    label: 'X',
                    value: '0',
                    isReadable: true,
                },
                y: {
                    label: 'Y',
                    value: '0',
                    isReadable: true,
                },
                endXCoord: {
                    label: 'x2',
                    value: '15',
                    isReadable: true,
                },
                endYCoord: {
                    label: 'y2',
                    value: '20',
                    isReadable: true,
                },
                stroke: {
                    label: 'Stroke',
                    value: `#000000`,
                    isReadable: true,
                },
            },
            zIndex: 0,
        });
    }
}

class Line implements IShape {
    type: ShapeType = ShapeType.LINE;
    config: ILineProps;
    isVisible: boolean = true;
    zIndex: number = 0;

    constructor(obj: ILineProps) {
        this.config = obj;
        this.config.id = `${this.type}-${genID(10)}`;
        this.zIndex = obj.zIndex ?? 0;
    }

    render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void,
        handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void,
        layerZIndex: number) {
        return <path
            id={this.config.id}
            key={this.config.id}
            data-type={this.type}
            role="shape"
            stroke={this.config.graphical.stroke?.value ?? 'black'}
            fill={this.config.graphical.fill?.value ?? 'black'}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={
                `M ${this.config.graphical.x.value},${this.config.graphical.y.value}
                l ${this.config.graphical.endXCoord.value},${this.config.graphical.endYCoord.value}`
            } />
        // <g transform={`translate(${this.elemProps.startCoords.x} ${this.elemProps.startCoords.y})`} id={this.elemProps.id} key={this.elemProps.id} stroke={this.elemProps.stroke ?? 'black'} onDragStart={(e) => e.preventDefault} onMouseDown={handlerMouseDown}>
        //     <line x1={this.elemProps.startCoords.x} y1={this.elemProps.startCoords.y} x2={this.elemProps.endCoord?.x} y2={this.elemProps.endCoord?.y} pathLength={this.elemProps.pathLength} />
        // </g>
        //);
    }
}


export default Line;