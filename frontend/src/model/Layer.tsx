import IShape from "./IShape";
import genID from "../common/helpers/genID";

export interface ILayer {
    id: string,
    title: string,
    zIndex: number,
    elems: IShape[],
    isVisible: boolean,
    isCurrent: boolean,
    changeVisible(val: boolean): void,
    getElems(): IShape[],
    setElems(shapes: IShape[]): void,
    addElem(shape: IShape): void,
    removeElem(elem: IShape): void,
    //copy(layer: ILayer): void,
}

class Layer implements ILayer {
    id: string;
    title: string;
    zIndex: number;
    elems: IShape[];
    isVisible: boolean;
    isCurrent: boolean;

    constructor(id: string = "reqertert", layersCount: number, title: string = "Layer", elems: IShape[]) {
        this.id = id;
        // this.title = `Layer${layersCount > 0 ? '_' + layersCount : ''}`;
        this.title = title;
        this.zIndex = layersCount * 1000;
        this.elems = elems;
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
    removeElem(delElem: IShape) {
        this.setElems(
            this.elems.filter(elem => elem !== delElem)
        );
    }
}

export default Layer;