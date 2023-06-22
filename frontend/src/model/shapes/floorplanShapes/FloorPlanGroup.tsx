import IShapeGroup from "../IShapeGroup";
import { DoorCreator } from "./Door";
import { RoomCreator } from "./Room";
import { WallCreator } from "./Wall";
import { WindowCreator } from "./Window";

const floorPlanGroup: IShapeGroup = {
    title: 'Floorplan',
    shapes: [
        new DoorCreator(),
        new WindowCreator(),
        new WallCreator(),
        new RoomCreator(),
    ]
}

export default floorPlanGroup;