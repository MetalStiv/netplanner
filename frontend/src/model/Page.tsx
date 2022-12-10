import { isTemplateMiddle } from "typescript";
import Layer from "./Layer";
import ILayer from "./Layer";

export interface IPage {
    id: number,
    title: string,
    layers: ILayer[],
    isCurrent: boolean,
    getLayers(): ILayer[],
    setLayers(layers: ILayer[]): void,
    addLayer(): void,
    setCurrentLayer(layerID: number): void,
    copy: (project: IPage) => void,
    copyLayers: (pages: ILayer[]) => void,
}

class Page implements IPage {
    id: number;
    title: string;
    layers: ILayer[];
    isCurrent: boolean;

    constructor(pagesCount: number, layers: ILayer[]) {
        this.id = parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(12).toString().replace('.', ''));
        this.title = `Page ${pagesCount + 1}`;
        this.layers = layers;
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
    copy(page: IPage) {
        this.id = page.id;
        this.title = page.title;
        this.copyLayers(page.getLayers())
        //this.layers = page.layers;
        this.isCurrent = page.isCurrent;
    }
    copyLayers(layers: ILayer[]) {
        this.layers = layers.map(layer => {
            let newLayer = new Layer(0, []);
            newLayer.copy(layer);
            return newLayer;
        })
    }
    getLayers() {
        return this.layers;
    }
    setLayers(layers: ILayer[]) {
        this.layers = layers;
    }
    addLayer() {
        this.layers.forEach(item => {
            if (item.isCurrent) {
                item.isCurrent = false;
            }
        });
        this.layers = [...this.layers, new Layer(this.layers.length, [])];
    }
}

export default Page;