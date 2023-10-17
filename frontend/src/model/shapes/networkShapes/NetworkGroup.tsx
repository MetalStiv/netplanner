import { GroupType } from "../GroupType";
import IShapeGroup from "../IShapeGroup";
import { AccessPointCreator } from "./AccessPoint";
import { DesktopCreator } from "./Desktop";

const networkGroup: IShapeGroup = {
    labelName: GroupType.NETWORK,
    shapes: [
        new AccessPointCreator(),
        new DesktopCreator(),
    ]
}

export default networkGroup;