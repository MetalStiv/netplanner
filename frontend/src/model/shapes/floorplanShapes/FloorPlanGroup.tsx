import { GroupType } from "../GroupType";
import IShapeGroup from "../IShapeGroup";
import { BathCreator } from "./Bath";
import { DoorCreator } from "./Door";
import { RoomCreator } from "./Room";
import { ShowerCabinCreator } from "./ShowerCabin";
import { SinkCreator } from "./Sink";
import { StairCreator } from "./Stair";
import { StoveCreator } from "./Stove";
import { ToiletCreator } from "./Toilet";
import { WallCreator } from "./Wall";
import { WindowCreator } from "./Window";

const floorPlanGroup: IShapeGroup = {
    labelName: GroupType.FLOORPLAN,
    shapes: [
        new DoorCreator(),
        new WindowCreator(),
        new WallCreator(),
        new RoomCreator(),
        new StairCreator(),
        new SinkCreator(),
        new ShowerCabinCreator(),
        new BathCreator(),
        new ToiletCreator(),
        new StoveCreator(),
    ]
}

export default floorPlanGroup;