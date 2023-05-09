import Page from "./Page";
import IShapesGroup from "../shapes/IShapeGroup";

const idSym: unique symbol = Symbol();
const titleSym: unique symbol = Symbol();
const shapesGroupsSym: unique symbol = Symbol();
const pagesSym: unique symbol = Symbol();
const isLoadingSym: unique symbol = Symbol();

export interface IProject {
    [idSym]: string;
    [titleSym]: string;
    [shapesGroupsSym]: IShapesGroup[];
    [pagesSym]: Page[];
    [isLoadingSym]: boolean;
    getID: () => string,
    getTitle: () => string,
    setTitle: (newTitle: string) => void,
    isLoading: () => boolean,
    setIsLoading: (value: boolean) => void,
    getShapesGroups: () => IShapesGroup[],
    setPages: (page: Page[]) => void,
    getPages: () => Page[],
    addPage: (newPage: Page) => void,
    getCurrentPage: () => Page,
    setCurrentPage: (pageID: string) => void,
}

class Project implements IProject {
    [idSym]: string;
    [titleSym]: string;
    [shapesGroupsSym]: IShapesGroup[];
    [pagesSym]: Page[];
    [isLoadingSym]: boolean;

    constructor(shapesGroups: IShapesGroup[], title: string = "Project", id: string, pages: Page[] = []) {
        this[idSym] = id;
        this[isLoadingSym] = true;
        this[titleSym] = title;
        this[shapesGroupsSym] = shapesGroups;
        this[pagesSym] = pages;
    }

    getID() {
        return this[idSym];
    }

    getTitle() {
        return this[titleSym];
    }

    setTitle(newTitle: string) {
        this[titleSym] = newTitle;
    }

    isLoading() {
        return this[isLoadingSym];
    }

    setIsLoading(value: boolean) {
        this[isLoadingSym] = value;
    }

    getShapesGroups() {
        return this[shapesGroupsSym];
    }

    setCurrentPage(pageID: string) {
        this.setPages(this.getPages().map(page => {
            page.isCurrent() && page.setIsCurrent(false);
            page.getID() === pageID && page.setIsCurrent(true);
            return page;
        }))
    }

    getCurrentPage() {
        return this.getPages().find(page => page.isCurrent()) || this.getPages()[0]
    }

    getPages() {
        return this[pagesSym];
    }

    setPages(pages: Page[]) {
        this[pagesSym] = pages;
    }

    addPage(newPage: Page) {
        this.getPages().forEach(page => page.isCurrent() && page.setIsCurrent(false))
        this.setPages([...this.getPages(), newPage]);
    }
}

export default Project;