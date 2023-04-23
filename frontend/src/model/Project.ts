import Page from "./Page";
import IShapesGroup from "./IGeometryGroup";
import genID from "../common/helpers/genID";
import titleUniqueization from "../common/helpers/titleUniquezation";
// import Layer, { ILayer } from "./Layer";
// import IShape from "./IShape";

export interface IProject {
    id: string,
    title: string,
    shapesGroups?: IShapesGroup[],
    pages?: Page[],
    isLoading: boolean,
    setPages: (page: Page[]) => void,
    getPages: () => Page[],
    addPage: () => void,
    getCurrentPage: () => Page,
    setCurrentPage: (pageID: string) => void,
    //copy: (project: IProject) => void,
}

class Project implements IProject {
    id: string;
    title: string;
    shapesGroups: IShapesGroup[];
    pages: Page[];
    isLoading: boolean;

    constructor(shapesGroups: IShapesGroup[], title: string = "Project", id: string) {
        this.id = id;
        this.isLoading = true;
        this.title = title;
        this.shapesGroups = shapesGroups;
        this.pages = [];
    }

    // copy(project: IProject) {
    //     this.id = project.id;
    //     this.title = project.title;
    //     this.shapesGroups = project.shapesGroups ?? [];
    //     //this.copyPages(project.getPages());
    //     // this.pages = project.pages ?? [];
    // }

    // copyPages(pages: Page[]) {
    //     this.pages = pages.map(page => {
    //         let newPage = new Page(0);
    //         newPage.copy(page);
    //         return newPage;
    //     })
    // }

    setCurrentPage(pageID: string) {
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
        return this.getPages().find(page => {
            if (page.isCurrent) {
                return true;
            }
            return false;
        }) || this.getPages()[0]
    }

    getPages() {
        return this.pages;
    }

    setPages(pages: Page[]) {
        this.pages = pages;
    }

    addPage(title: string = "Page") {
        this.pages.forEach(page => {
            if (page.isCurrent) {
                page.isCurrent = false;
            }
        })
        this.setPages([...this.pages, new Page("qwe", "qwer", [])]);
    }
}

export default Project;