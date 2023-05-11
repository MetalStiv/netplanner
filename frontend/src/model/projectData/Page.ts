import Layer, { ILayer } from "./Layer";
// import genID from "../common/helpers/genID";
// import titleUniqueization from "../common/helpers/titleUniquezation";

// export interface Page {
//     id: number,
//     title: string,
//     layers: ILayer[],
//     isCurrent: boolean,
//     getLayers(): ILayer[],
//     addLayer(title?: string): void,
//     setLayers(layers: ILayer[]): void,
//     setCurrentLayer(layerID: number): void,
//     titleUniqueization(title: string): string,

//     _genID(length: number): number,

//     //copy: (project: Page) => void,
//     //copyLayers: (pages: ILayer[]) => void,
// }

const idSym: unique symbol = Symbol();
const titleSym: unique symbol = Symbol();
const layersSym: unique symbol = Symbol();
const isCurrentSym: unique symbol = Symbol();

class Page implements Page {
    [idSym]: string;
    [titleSym]: string;
    [layersSym]: ILayer[];
    [isCurrentSym]: boolean;

    constructor(id: string = "", title: string = "Page", layers: ILayer[] = []) {
        this[idSym] = id;
        this[titleSym] = title;
        this[layersSym] = layers;
        this[isCurrentSym] = true;
    }

    setCurrentLayer(layerID: string) {
        this.getLayers().map(item => {
            item.isCurrent() && item.setIsCurrent(false);
            item.getID() === layerID && item.setIsCurrent(true);
            return item;
        })
        // this.getLayers().forEach(layer => {
        //     if (layer.getID() === layerID) {
        //         layer.setIsCurrent(true);
        //     }
        //     else {
        //         if (layer.getIsCurrent()) {
        //             layer.setIsCurrent(false);
        //         }
        //     }
        // })
    }

    getLayers() {
        return this[layersSym];
    }

    setLayers(layers: ILayer[]) {
        this[layersSym] = layers;
    }

    // addLayer(title: string = "Layer") {
    //     this.getLayers().forEach(item => {
    //         if (item.getIsCurrent()) {
    //             item.setIsCurrent(false);
    //         }
    //     });
    //     this[layersSym] = [...this.getLayers(), new Layer("eirotwert", this.getLayers().length, "hlkjhlk", [])];
    // }

    addLayer(newLayer: ILayer) {
        this.getLayers().forEach(item => {
            if (item.isCurrent()) {
                item.setIsCurrent(false);
            }
        });
        this[layersSym] = [...this.getLayers(), newLayer];
    }

    getCurrentLayer(): ILayer {
        return this.getLayers().find(layer => layer.isCurrent())!;
    }

    isCurrent(): boolean {
        return this[isCurrentSym];
    }

    getID(): string {
        return this[idSym];
    }

    setIsCurrent(val: boolean) {
        this[isCurrentSym] = val;
    }

    setTitle(newTitle: string) {
        this[titleSym] = newTitle;
    }

    getTitle(): string {
        return this[titleSym];
    }


}

export default Page;