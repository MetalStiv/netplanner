import Page from "./Page";
import IShapesGroup from "../shapes/IShapeGroup";

export interface IProject {
    id: string,
    title: string,
    shapesGroups: IShapesGroup[],
    pages: Page[],
    isLoading: boolean,
    setPages: (page: Page[]) => void,
    getPages: () => Page[],
    addPage: () => void,
    getCurrentPage: () => Page,
    setCurrentPage: (pageID: string) => void,
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

    setCurrentPage(pageID: string) {
        this.pages.forEach(item => {
            if (item.getID() === pageID) {
                item.setIsCurrent(true);
            }
            else {
                if (item.isCurrent()) {
                    item.setIsCurrent(false);
                }
            }
        })
    }

    getCurrentPage() {
        return this.getPages().find(page => {
            if (page.isCurrent()) {
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
            if (page.isCurrent()) {
                page.setIsCurrent(false);
            }
        })
        this.setPages([...this.pages, new Page("qwe", "qwer", [])]);
    }
}

export default Project;