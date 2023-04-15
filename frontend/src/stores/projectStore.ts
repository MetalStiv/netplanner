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

const projectSymbol: unique symbol = Symbol()

interface IProjectStore {
    [projectSymbol]: IProject | null,
    setProject: (p: IProject) => void,
    getProject: () => IProject | null,

    clearStore: () => void,
}

export const createProjectStore = () => {
    const store: IProjectStore = {
        [projectSymbol]: null,

        setProject(p: IProject) {
            this[projectSymbol] = p;
        },

        getProject() {
            return this[projectSymbol];
        },

        clearStore(){
            this[projectSymbol] = null;
        }
    };

    return store
}

export type TProjectStore = ReturnType<typeof createProjectStore>