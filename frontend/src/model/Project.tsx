import Page from "./Page";
import IPage from "./Page";
import IShapesGroup from "./IGeometryGroup";
import Layer, { ILayer } from "./Layer";
import IShape from "./IShape";

export interface IProject {
    id: number,
    title: string,
    shapesGroups?: IShapesGroup[],
    pages?: IPage[],
    setPages: (page: Array<IPage>) => void,
    getPages: () => IPage[],
    addPage: () => void,
    getCurrentPage: () => IPage,
    setCurrentPage: (pageID: number) => void,
    copy: (project: IProject) => void,
}

class Project implements IProject {
    id: number;
    title: string;
    shapesGroups: IShapesGroup[];
    pages: IPage[];

    constructor(projectsCount: number, shapesGroups: IShapesGroup[], pages: IPage[]) {
        this.id = this.generateID();
        this.title = `Project${projectsCount > 0 ? ' ' + projectsCount : ''}`;
        this.shapesGroups = shapesGroups;
        this.pages = pages;
    }

    private generateID() {
        return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(12).toString().replace('.', ''));
    }

    copy(project: IProject) {
        this.id = project.id;
        this.title = project.title;
        this.shapesGroups = project.shapesGroups ?? [];
        this.copyPages(project.getPages());
        // this.pages = project.pages ?? [];
    }

    copyPages(pages: IPage[]) {
        this.pages = pages.map(page => {
            let newPage = new Page(0, []);
            newPage.copy(page);
            return newPage;
        })
    }

    setCurrentPage(pageID: number) {
        this.pages.forEach(item => {
            if (item.id === pageID) {
                item.isCurrent = true;
            }
            else {
                if (item.isCurrent) {
                    item.isCurrent = false;
                }
            }
        })
    }
    getCurrentPage() {
        return this.pages.find(page => {
            if (page.isCurrent) {
                return true;
            }
            return false;
        }) || this.getPages()[0]
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
        this.pages = [...this.pages, new Page(this.pages.length, [new Layer(0, [] as IShape[])] as ILayer[])];
    }
}

export default Project;