import { GroupType } from "../GroupType";
import IShapeGroup from "../IShapeGroup"
import { BeginEndCreator } from "./BeginEnd";
import { CommentCreator } from "./Comment";
import { DecisionCreator } from "./Decision";
import { InputOutputCreator } from "./InputOutput";
import { ModificationCreator } from "./Modification";
import { OperationCreator } from "./Operation";
import { ProcessCreator } from "./Process";
import { RepeatCreator } from "./Repeat";

const blockDiagramGroup: IShapeGroup = {
    labelName: GroupType.BLOCK_DIAGRAM,
    shapes: [
        new BeginEndCreator(),
        new OperationCreator(),
        new ProcessCreator(),
        new DecisionCreator(),
        new ModificationCreator(),
        new InputOutputCreator(),
        new RepeatCreator(),
        new CommentCreator(),
    ]
}

export default blockDiagramGroup;