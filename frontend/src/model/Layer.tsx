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
    //copy(layer: ILayer): void,
}

class Layer implements ILayer {
    id: number;
    title: string;
    zIndex: number;
    elems: IShape[];
    isVisible: boolean;
    isCurrent: boolean;

    constructor(layersCount: number, title: string = "Layer") {
        this.id = this._genID(12);
        // this.title = `Layer${layersCount > 0 ? '_' + layersCount : ''}`;
        this.title = title;
        this.zIndex = layersCount * 1000;
        this.elems = [] as IShape[];
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
        shape.config.zIndex = this.elems.length;
        this.elems = [...this.elems, shape];
    }

    private _genID(length: number) {
        return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace('.', ''));
    }
}

export default Layer;