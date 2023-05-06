import IShapeCreator from "../IShapeCreator";
import genID from "../../../common/helpers/genID";
import { ShapeType } from "../ShapeType";
import IShape, { IGraphicalProperty, IShapeConfig, IShapeGraphicalProps } from "../IShape";

interface ILineGraphicalProps extends IShapeGraphicalProps {
    endXCoord: IGraphicalProperty,
    endYCoord: IGraphicalProperty,
    strokeColor: IGraphicalProperty,
}

interface ILineConfig extends IShapeConfig {
    id?: string,
    graphicalProperties: ILineGraphicalProps,
    zIndex: number,
}

export class LineCreator implements IShapeCreator {
    type: ShapeType = ShapeType.LINE;
    create() {
        return new Line({
            graphicalProperties: {
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
                pivot: {
                    label: 'Pivot',
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
                strokeColor: {
                    label: 'Stroke Color',
                    value: '#000000',
                    isReadable: true,
                }
            },
            zIndex: 0,
        });
    }
}

class Line implements IShape {
    type: ShapeType = ShapeType.LINE;
    config: ILineConfig;
    isVisible: boolean = true;
    zIndex: number = 0;

    constructor(obj: ILineConfig) {
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
            stroke={this.config.graphicalProperties.strokeColor.value ?? 'black'}
            style={{ display: this.isVisible ? 'inline' : 'none', zIndex: this.config.zIndex + layerZIndex }}
            onDragStart={(e) => e.preventDefault}
            onMouseDown={handlerMouseDown}
            onClick={handlerClick}
            d={
                `M ${this.config.graphicalProperties.x.value},${this.config.graphicalProperties.y.value}
                l ${this.config.graphicalProperties.endXCoord.value},${this.config.graphicalProperties.endYCoord.value}`
            } />
    }
}


export default Line;