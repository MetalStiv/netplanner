import IShape from "./IShape";

export interface ILayer {
    id: number,
    title: string,
    zIndex: number,
    elems: IShape[],
    isVisible: boolean,
    isCurrent: boolean,
    changeVisible(val: boolean): void,
    getElems(): IShape[],
    setElems(shapes: IShape[]): void,
    addElem(shape: IShape): void,
    //render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void, 
    //handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void): JSX.Element;
}

class Layer implements ILayer {
    id: number;
    title: string;
    zIndex: number;
    elems: IShape[];
    isVisible: boolean;
    isCurrent: boolean;

    constructor(layersCount: number, shapes: IShape[]) {
        this.id = parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(12).toString().replace('.', ''));
        this.title = `Layer${layersCount > 0 ? '_' + layersCount : ''}`;
        this.zIndex = layersCount + 1;
        this.elems = shapes;
        this.isVisible = true;
        this.isCurrent = true;
    }

    changeVisible(val: boolean) {
        this.isVisible = val;
        this.elems.forEach(item => {
            item.isVisible = val;
        })
    }
    getElems() {
        return this.elems;
    }
    setElems(shapes: IShape[]) {
        this.elems = shapes;
    }
    addElem(shape: IShape) {
        shape.zIndex = this.zIndex;
        this.elems = [...this.elems, shape];
    }
}

export default Layer;