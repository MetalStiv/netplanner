import IShape from "./IShape";
import IShapesGroup from "./IShapesGroup";

interface IProject {
    name?: string,
    shapesGroups?: IShapesGroup[], //IShape[];
    renderedShapes?: IShape[],
    setShapes: (shapes: Array<IShape>) => void,
    addShape: (shape: IShape) => void,
}

export default IProject;