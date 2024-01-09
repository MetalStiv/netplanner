import { GroupType } from "../GroupType";
import IShapeGroup from "../IShapeGroup";
import { AccessPointCreator } from "./AccessPoint";
import { DesktopCreator } from "./Desktop";
import { FirewallCreator } from "./Firewall";
import { PrinterCreator } from "./Printer";
import { SubnetCreator } from "./Subnet";

const networkGroup: IShapeGroup = {
    labelName: GroupType.NETWORK,
    shapes: [
        new SubnetCreator(),
        new FirewallCreator(),
        new AccessPointCreator(),
        new DesktopCreator(),
        new PrinterCreator(),
    ]
}

export default networkGroup;