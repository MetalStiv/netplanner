import ILayer from "../model/Layer";
import IPage from "../model/Page";
import IProject from "../model/Project";
import IShape from "../model/IShape";
import Circle, { CircleCreator } from "../model/primitives/Circle";
import Ellipse, { EllipseCreator } from "../model/primitives/Ellipse";
import Line, { LineCreator } from "../model/primitives/Line";
import Point, { PointCreator } from "../model/primitives/Point";
import Polyline, { PolylineCreator } from "../model/primitives/Polyline";
import PrimitivesGroup from "../model/primitives/PrimitivesGroup";
import Rect, { RectCreator } from "../model/primitives/Rect";
import Layer from "../model/Layer";
import Project from "../model/Project";
import Page from "../model/Page";
import PolygonsGroup from "../model/primitives/PolygonsGroup";

const projectsSymbol: unique symbol = Symbol()

interface IProjectStore {
    [projectsSymbol]: IProject[],
    getProjects: () => IProject[],
}

export const createProjectStore = () => {
    const store: IProjectStore = {
        [projectsSymbol]: [
            new Project(
                0,
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
                ],
                [
                    new Page(
                        0,
                        [
                            new Layer(
                                0,
                                [
                                    //     new Rect({
                                    //         graphical: {
                                    //             startCoords: {
                                    //                 x: 250,
                                    //                 y: 250,
                                    //             },
                                    //             sizes: {
                                    //                 w: 15,
                                    //                 h: 10
                                    //             }
                                    //         },
                                    //     }),
                                    //     new Circle({
                                    //         graphical: {
                                    //             startCoords: {
                                    //                 x: 200,
                                    //                 y: 200,
                                    //             },
                                    //             r: 10,
                                    //         },
                                    //         stroke: 'red',
                                    //         fill: 'blue',
                                    //     }),
                                    //     new Line({
                                    //         graphical: {
                                    //             startCoords: {
                                    //                 x: 15,
                                    //                 y: 35,
                                    //             },
                                    //             endCoords: {
                                    //                 x: 253,
                                    //                 y: 150
                                    //             }
                                    //         },

                                    //     }),

                                    //     new Polyline({
                                    //         graphical: {
                                    //             startCoords: {
                                    //                 x: 2,
                                    //                 y: 3,
                                    //             },
                                    //             points: [[15, 80], [120, 65], [50, 16], [25, 25]],
                                    //         },
                                    //         stroke: 'green'
                                    //     }),

                                    //     new Point({
                                    //         graphical: {
                                    //             startCoords: {
                                    //                 x: 274,
                                    //                 y: 183
                                    //             },
                                    //             r: 1,
                                    //         },
                                    //     }),

                                    //     new Ellipse({
                                    //         graphical: {
                                    //             startCoords: {
                                    //                 x: 174,
                                    //                 y: 123
                                    //             },
                                    //             rDif: {
                                    //                 rx: 150,
                                    //                 ry: 25,
                                    //             },
                                    //         },

                                    //         fill: 'yellow'
                                    //     }),
                                ] as IShape[])
                        ] as ILayer[])
                ] as IPage[])
        ] as IProject[],

        getProjects() {
            return this[projectsSymbol];
        },
    };

    return store
}

export type TProjectStore = ReturnType<typeof createProjectStore>