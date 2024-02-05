import Page from "./Page";
import IShapesGroup from "../shapes/IShapeGroup";
import UserCursor from "./UserCursor";
import { cursorLiveTime } from "../../common/constants";
import ICoords from "../../common/model/ICoords";

const idSym: unique symbol = Symbol();
const titleSym: unique symbol = Symbol();
const shapesGroupsSym: unique symbol = Symbol();
const pagesSym: unique symbol = Symbol();
const isLoadingSym: unique symbol = Symbol();
const userCursorsSym: unique symbol = Symbol();

export interface IProject {
    [idSym]: string;
    [titleSym]: string;
    [shapesGroupsSym]: IShapesGroup[];
    [pagesSym]: Page[];
    [isLoadingSym]: boolean;
    [userCursorsSym]: UserCursor[];
    getID: () => string,
    getTitle: () => string,
    setTitle: (newTitle: string) => void,
    isLoading: () => boolean,
    setIsLoading: (value: boolean) => void,
    getShapesGroups: () => IShapesGroup[],
    setPages: (page: Page[]) => void,
    getPages: () => Page[],
    addPage: (newPage: Page) => void,
    deletePageById: (id: string) => void,
    getCurrentPage: () => Page,
    setCurrentPage: (pageID: string) => void,

    getCursors: () => UserCursor[],
    setCursors: (userCursors: UserCursor[]) => void,
    addCursor: (userCursor: UserCursor) => void,
    moveCursor: (userId: string, coord: ICoords) => Promise<void>,
    killOldCursors: () => void,
}

class Project implements IProject {
    [idSym]: string;
    [titleSym]: string;
    [shapesGroupsSym]: IShapesGroup[];
    [pagesSym]: Page[];
    [isLoadingSym]: boolean;
    [userCursorsSym]: UserCursor[];

    constructor(shapesGroups: IShapesGroup[], title: string = "Project", id: string, pages: Page[] = [],
        userCursors: UserCursor[] = []) {
        this[idSym] = id;
        this[isLoadingSym] = true;
        this[titleSym] = title;
        this[shapesGroupsSym] = shapesGroups;
        this[pagesSym] = pages;
        this[userCursorsSym] = userCursors;
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

    deletePageById(id: string) {
        const ind = this[pagesSym].findIndex(p => p.getID() === id)
        this[pagesSym] = [...this[pagesSym].slice(0, ind), ...this[pagesSym].slice(ind + 1, this[pagesSym].length)]
    }

    getCursors() {
        return this[userCursorsSym];
    }

    setCursors(userCursors: UserCursor[]) {
        this[userCursorsSym] = userCursors;
    }

    addCursor(userCursor: UserCursor) {
        if (!this[userCursorsSym].find(c => c.userId === userCursor.userId)) {
            this[userCursorsSym] = [...this[userCursorsSym], userCursor]
        }
    }

    async moveCursor(userId: string, coord: ICoords) {
        await this[userCursorsSym].find(c => c.userId === userId)
            ?.moveCursor(coord);
    }

    killOldCursors() {
        this[userCursorsSym] = this[userCursorsSym]
            .filter(c => (Date.now() - c.actionTime) < cursorLiveTime)
    }
}

export default Project;