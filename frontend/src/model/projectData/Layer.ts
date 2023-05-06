import IShape from "../shapes/IShape";

const idSym: unique symbol = Symbol();
const titleSym: unique symbol = Symbol();
const zIndexSym: unique symbol = Symbol();
const shapesSym: unique symbol = Symbol();
const isVisibleSym: unique symbol = Symbol();
const isCurrentSym: unique symbol = Symbol();

export interface ILayer {
    [idSym]: string,
    [titleSym]: string,
    [zIndexSym]: number,
    [shapesSym]: IShape[],
    [isVisibleSym]: boolean,
    [isCurrentSym]: boolean,
    changeVisible(val: boolean): void,
    setIsCurrent(val: boolean): void,
    getID(): string,
    getTitle(): string,
    setTitle(newTitle: string): void,
    getZIndex(): number,
    setZIndex(val: number): void,
    getIsCurrent(): boolean,
    getIsVisible(): boolean,
    getShapes(): IShape[],
    setShapes(shapes: IShape[]): void,
    addShape(shape: IShape): void,
    removeShape(shape: IShape): void,
    //copy(layer: ILayer): void,
}

class Layer implements ILayer {
    [idSym]: string;
    [titleSym]: string;
    [zIndexSym]: number;
    [shapesSym]: IShape[];
    [isVisibleSym]: boolean;
    [isCurrentSym]: boolean;

    constructor(id: string = "reqertert", layersCount: number, title: string = "Layer", shapes: IShape[]) {
        this[idSym] = id;
        this[titleSym] = title;
        this[zIndexSym] = layersCount * 1000;
        this[shapesSym] = shapes;
        this[isVisibleSym] = true;
        this[isCurrentSym] = true;
    }

    changeVisible(val: boolean) {
        this[isVisibleSym] = val;
        this[shapesSym].forEach(item => {
            item.isVisible = val;
        })
    }
    setIsCurrent(val: boolean) {
        this[isCurrentSym] = val;
    }
    getID() {
        return this[idSym];
    }
    getTitle() {
        return this[titleSym];
    }
    setTitle(newTitle: string) {
        this[titleSym] = newTitle;
    }
    getZIndex() {
        return this[zIndexSym];
    }
    setZIndex(val: number) {
        this[zIndexSym] = val;
    }
    getShapes() {
        return this[shapesSym];
    }
    getIsCurrent() {
        return this[isCurrentSym];
    }
    getIsVisible() {
        return this[isVisibleSym];
    }
    setShapes(shapes: IShape[]) {
        this[shapesSym] = shapes;
    }
    addShape(shape: IShape) {
        shape.config.zIndex = this[shapesSym].length;
        this[shapesSym] = [...this[shapesSym], shape];
    }
    removeShape(delShape: IShape) {
        this.setShapes(
            this[shapesSym].filter(shape => shape !== delShape)
        );
    }
}

export default Layer;