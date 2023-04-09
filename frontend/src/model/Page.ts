import Layer, { ILayer } from "./Layer";
import genID from "../common/helpers/genID";
import titleUniqueization from "../common/helpers/titleUniquezation";

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

class Page implements Page {
    id: number;
    title: string;
    layers: ILayer[];
    isCurrent: boolean;

    constructor(title: string = "Page", layers?: ILayer[]) {
        this.id = genID(12);
        //this.title = `Page ${pagesCount + 1}`;
        this.title = title;
        this.layers = layers ?? [new Layer(0)] as ILayer[];
        this.isCurrent = true;
    }

    setCurrentLayer(layerID: number) {
        this.layers.forEach(item => {
            if (item.id === layerID) {
                item.isCurrent = true;
            }
            else {
                if (item.isCurrent) {
                    item.isCurrent = false;
                }
            }
        })
    }
    // copy(page: Page) {
    //     this.id = page.id;
    //     this.title = page.title;
    //     this.copyLayers(page.getLayers())
    //     //this.layers = page.layers;
    //     this.isCurrent = page.isCurrent;
    // }
    // copyLayers(layers: ILayer[]) {
    //     this.layers = layers.map(layer => {
    //         let newLayer = new Layer(0, []);
    //         newLayer.copy(layer);
    //         return newLayer;
    //     })
    // }
    getLayers() {
        return this.layers;
    }
    setLayers(layers: ILayer[]) {
        this.layers = layers;
    }
    addLayer(title: string = "Layer") {
        this.getLayers().forEach(item => {
            if (item.isCurrent) {
                item.isCurrent = false;
            }
        });
        this.layers = [...this.getLayers(), new Layer(this.layers.length, titleUniqueization(title, this.getLayers()))];
    }
    getCurrentLayer(): ILayer {
        return this.getLayers().find(layer => layer.isCurrent)!;
    }


}

export default Page;