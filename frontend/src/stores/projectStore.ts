// import ILayer from "../model/Layer";
// import Page from "../model/Page";
import IProject from "../model/Project";
//import IShape from "../model/IShape";
import { CircleCreator } from "../model/primitives/Circle";
import { EllipseCreator } from "../model/primitives/Ellipse";
import { LineCreator } from "../model/primitives/Line";
import { PointCreator } from "../model/primitives/Point";
import { PolylineCreator } from "../model/primitives/Polyline";
import { RectCreator } from "../model/primitives/Rect";
import IGeometryGroup from "../model/IGeometryGroup";
import PrimitivesGroup from "../model/primitives/PrimitivesGroup";
import PolygonsGroup from "../model/primitives/PolygonsGroup";
//import Layer from "../model/Layer";
import Project from "../model/Project";
//import Page from "../model/Page";


const projectsSymbol: unique symbol = Symbol()

interface IProjectStore {
    [projectsSymbol]: IProject[],
    addProject: () => void,
    getProjects: () => IProject[],
    setCurrentProject: (layerID: number) => void,
    getCurrentProject: () => IProject,
    _titleUniqueization: (title: string) => string,

    clearStore: () => void,
}

export const createProjectStore = () => {
    const store: IProjectStore = {
        [projectsSymbol]: [
            new Project(
                [
                    new PolygonsGroup([
                        new CircleCreator(),
                        new EllipseCreator(),
                        new RectCreator(),
                    ]),
                    new PrimitivesGroup([
                        new LineCreator(),
                        new PolylineCreator(),
                        new PointCreator(),
                    ])
                ] as IGeometryGroup[]
                // [
                //     new Page(
                //         0,
                //         [
                //             new Layer(
                //                 0,
                //                 //[
                //                     //     new Rect({
                //                     //         graphical: {
                //                     //             startCoords: {
                //                     //                 x: 250,
                //                     //                 y: 250,
                //                     //             },
                //                     //             sizes: {
                //                     //                 w: 15,
                //                     //                 h: 10
                //                     //             }
                //                     //         },
                //                     //     }),
                //                     //     new Circle({
                //                     //         graphical: {
                //                     //             startCoords: {
                //                     //                 x: 200,
                //                     //                 y: 200,
                //                     //             },
                //                     //             r: 10,
                //                     //         },
                //                     //         stroke: 'red',
                //                     //         fill: 'blue',
                //                     //     }),
                //                     //     new Line({
                //                     //         graphical: {
                //                     //             startCoords: {
                //                     //                 x: 15,
                //                     //                 y: 35,
                //                     //             },
                //                     //             endCoords: {
                //                     //                 x: 253,
                //                     //                 y: 150
                //                     //             }
                //                     //         },

                //                     //     }),

                //                     //     new Polyline({
                //                     //         graphical: {
                //                     //             startCoords: {
                //                     //                 x: 2,
                //                     //                 y: 3,
                //                     //             },
                //                     //             points: [[15, 80], [120, 65], [50, 16], [25, 25]],
                //                     //         },
                //                     //         stroke: 'green'
                //                     //     }),

                //                     //     new Point({
                //                     //         graphical: {
                //                     //             startCoords: {
                //                     //                 x: 274,
                //                     //                 y: 183
                //                     //             },
                //                     //             r: 1,
                //                     //         },
                //                     //     }),

                //                     //     new Ellipse({
                //                     //         graphical: {
                //                     //             startCoords: {
                //                     //                 x: 174,
                //                     //                 y: 123
                //                     //             },
                //                     //             rDif: {
                //                     //                 rx: 150,
                //                     //                 ry: 25,
                //                     //             },
                //                     //         },

                //                     //         fill: 'yellow'
                //                     //     }),
                //                 //] as IShape[])
                //         ] as ILayer[])
                // ] as Page[]
            )
        ] as IProject[],

        addProject(title: string = "Project") {
            this.getProjects().forEach(item => {
                if (item.isCurrent) {
                    item.isCurrent = false;
                }
            });
            this[projectsSymbol] = [...this[projectsSymbol], new Project([] as IGeometryGroup[], this._titleUniqueization(title))];
        },

        setCurrentProject(layerID: number) {
            this[projectsSymbol].forEach(item => {
                if (item.id === layerID) {
                    item.isCurrent = true;
                }
                else {
                    if (item.isCurrent) {
                        item.isCurrent = false;
                    }
                }
            })
        },

        getCurrentProject() {
            return this[projectsSymbol].find(project => {
                if (project.isCurrent) {
                    return true;
                }
                return false;
            }) || this[projectsSymbol][0];
        },

        getProjects() {
            return this[projectsSymbol];
        },

        _titleUniqueization(title: string) {
            let copyIndex = 0;
            while (true) {
                if (this[projectsSymbol].find(item => item.title === (title + (copyIndex === 0 ? '' : `_${copyIndex}`)))) {
                    copyIndex++;
                }
                else {
                    break;
                }
            }
            if (copyIndex > 0) {
                title += `_${copyIndex}`;
            }
            return title;
        },

        clearStore(){
            this[projectsSymbol] = [];
        }
    };

    return store
}

export type TProjectStore = ReturnType<typeof createProjectStore>