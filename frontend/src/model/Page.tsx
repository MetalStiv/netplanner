import Layer, { ILayer } from "./Layer";

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

    constructor(pagesCount: number, title: string = "Page") {
        this.id = this._genID(12);
        //this.title = `Page ${pagesCount + 1}`;
        this.title = title;
        this.layers = [new Layer(0)] as ILayer[];
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
        this.layers = [...this.getLayers(), new Layer(this.layers.length, this.titleUniqueization(title))];
    }

    private _genID(length: number) {
        return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace('.', ''))
    }

    titleUniqueization(title: string, renamingItemID?: number) {
        let copyIndex = 0;
        while (true) {
            if (this.getLayers().find(item => item.id !== renamingItemID && item.title === (title + (copyIndex === 0 ? '' : `_${copyIndex}`)))) {
                copyIndex++;
            }
            else {
                break;
            }
        }
        if (copyIndex > 0) {
            title += `_${copyIndex}`;
        }
        return title;
    }
}

export default Page;