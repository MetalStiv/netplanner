import Page from "./Page";
import IPage from "./Page";
import IShapesGroup from "./IShapesGroup";

export interface IProject {
    id: number,
    name?: string,
    shapesGroups?: IShapesGroup[],
    pages?: IPage[],
    setPages: (page: Array<IPage>) => void,
    getPages: () => IPage[],
    addPage: (page: IPage) => void,
}

class Project implements IProject {
    id: number;
    title: string;
    shapesGroups: IShapesGroup[];
    pages: IPage[];

    constructor(projectsCount: number, shapesGroups: IShapesGroup[], pages: IPage[]) {
        this.id = parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(12).toString().replace('.', ''));
        this.title = `Project${projectsCount > 0 ? ' ' + projectsCount : ''}`;
        this.shapesGroups = shapesGroups;
        this.pages = pages;
    }

    getPages() {
        return this.pages;
    }
    setPages(pages: IPage[]) {
        this.pages = pages;
    }
    addPage() {
        this.pages.forEach(page => {
            if (page.isCurrent) {
                page.isCurrent = false;
            }
        })
        this.pages = [...this.pages, new Page(this.pages.length, [])];
    }
}

export default Project;