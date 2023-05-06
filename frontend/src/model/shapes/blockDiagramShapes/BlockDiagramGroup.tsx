import IShapeGroup from "../IShapeGroup"
import { BeginEndCreator } from "./BeginEnd";
import { DecisionCreator } from "./Decision";
import { InputOutputCreator } from "./InputOutput";
import { ModificationCreator } from "./Modification";
import { OperationCreator } from "./Operation";
import { ProcessCreator } from "./Process";
import { RepeatCreator } from "./Repeat";

const blockDiagramGroup: IShapeGroup = {
    title: 'Block Diagram',
    shapes: [
        new BeginEndCreator(),
        new OperationCreator(),
        new ProcessCreator(),
        new DecisionCreator(),
        new ModificationCreator(),
        new InputOutputCreator(),
        new RepeatCreator(),
    ]
}

export default blockDiagramGroup;