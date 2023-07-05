interface ICanvasConfig {
    a4Width: number,
    a4Height: number,
    widthInSheets: number,
    heightInSheets: number,
    offsetX: number,
    offsetY: number,
    readonly canvasWidth: number,
    readonly canvasHeight: number,
    sheetStrokeColor: string,
    sheetFillColor: string,
    gridStep: number,
    gridColor: string,
    subgridColor: string,
    subgridParts: number,
    readonly subgridStep: number
}

export const Portrait: ICanvasConfig = {
    a4Width: 1050,
    a4Height: 1485,
    // widthInSheets: 17,
    // heightInSheets: 12,
    widthInSheets: 1,
    heightInSheets: 1,
    offsetX: 200,
    offsetY: 100,
    get canvasWidth(): number { return this.a4Width * this.widthInSheets + this.offsetX * 2 },
    get canvasHeight(): number { return this.a4Height * this.heightInSheets + this.offsetY * 2 },
    sheetStrokeColor: "#176DEA",
    sheetFillColor: "#F9FBFA",
    gridStep: 105,
    gridColor: '#D0D0D0',
    subgridColor: '#F0F0F0',
    subgridParts: 5,
    get subgridStep(): number { return this.gridStep / this.subgridParts }
}

export const Landscape: ICanvasConfig = {
    a4Width: 1485,
    a4Height: 1050,
    widthInSheets: 12,
    heightInSheets: 17,
    offsetX: 200,
    offsetY: 100,
    get canvasWidth(): number { return this.a4Width * this.widthInSheets + this.offsetX * 2 },
    get canvasHeight(): number { return this.a4Height * this.heightInSheets + this.offsetY * 2 },
    sheetStrokeColor: "#176DEA",
    sheetFillColor: "##F9FBFA",
    gridStep: 105,
    gridColor: '#D0D0D0',
    subgridColor: '#F0F0F0',
    subgridParts: 5,
    get subgridStep(): number { return this.gridStep / this.subgridParts }
}

export default ICanvasConfig;