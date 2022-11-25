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
    //render(handlerMouseDown: (e: React.MouseEvent<SVGGeometryElement>) => void, 
    //handlerClick: (e: React.MouseEvent<SVGGeometryElement>) => void): JSX.Element;
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