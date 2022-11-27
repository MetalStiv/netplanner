import Page from "./Page";
import IPage from "./Page";
import IShapesGroup from "./IShapesGroup";

export interface IProject {
    id: number,
    title: string,
    shapesGroups?: IShapesGroup[],
    pages?: IPage[],
    setPages: (page: Array<IPage>) => void,
    getPages: () => IPage[],
    addPage: (page: IPage) => void,
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
        this.pages = project.pages ?? [];
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
                return page;
            }
        })!
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