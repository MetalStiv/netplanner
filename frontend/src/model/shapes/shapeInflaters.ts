import IShape from "./IShape";
import { beginEndInflater } from "./blockDiagramShapes/BeginEnd";
import { decisionInflater } from "./blockDiagramShapes/Decision";
import { inputOutputInflater } from "./blockDiagramShapes/InputOutput";
import { modificationInflater } from "./blockDiagramShapes/Modification";
import { operationInflater } from "./blockDiagramShapes/Operation";
import { processInflater } from "./blockDiagramShapes/Process";
import { repeatInflater } from "./blockDiagramShapes/Repeat";
import { circleInflater } from "./primitiveShapes/Circle";
import { IMessageShape } from "../message/IMessageShape";
import { ellipseInflater } from "./primitiveShapes/Ellipse";
import { lineInflater } from "./primitiveShapes/Line";
import { polylineInflater } from "./primitiveShapes/Polyline";
import { rectInflater } from "./primitiveShapes/Rect";
import { doorInflater } from "./floorplanShapes/Door";
import { windowInflater } from "./floorplanShapes/Window";
import { wallInflater } from "./floorplanShapes/Wall";
import { roomInflater } from "./floorplanShapes/Room";
import { stairInflater } from "./floorplanShapes/Stair";
import { sinkInflater } from "./floorplanShapes/Sink";
import { showerCabinInflater } from "./floorplanShapes/ShowerCabin";
import { bathInflater } from "./floorplanShapes/Bath";
import { toiletInflater } from "./floorplanShapes/Toilet";
import { stoveInflater } from "./floorplanShapes/Stove";
import { commentInflater } from "./blockDiagramShapes/Comment";
import { urinalInflater } from "./floorplanShapes/Urinal";
import { accessPointInflater } from "./networkShapes/AccessPoint";
import { desktopInflater } from "./networkShapes/Desktop";
import { subnetInflater } from "./networkShapes/Subnet";
import { firewallInflater } from "./networkShapes/Firewall";
import { printerInflater } from "./networkShapes/Printer";
import { mfuInflater } from "./networkShapes/Mfu";
import { scannerInflater } from "./networkShapes/Scanner";
import { textInflater } from "./primitiveShapes/Text";

export type TShapeInflater = (message: IMessageShape) => Promise<IShape | null>;

export interface IShapeInflaters {
    inflaters: TShapeInflater[],
    inflate: (message: IMessageShape) => Promise<IShape | null>
}

export const shapeInflaters: IShapeInflaters = {
    inflaters: [
        textInflater,
        circleInflater,
        ellipseInflater,
        lineInflater,
        polylineInflater,
        rectInflater,

        beginEndInflater,
        operationInflater,
        processInflater,
        decisionInflater,
        modificationInflater,
        inputOutputInflater,
        repeatInflater,
        commentInflater,

        doorInflater,
        windowInflater,
        wallInflater,
        roomInflater,
        stairInflater,
        sinkInflater,
        showerCabinInflater,
        bathInflater,
        toiletInflater,
        stoveInflater,
        urinalInflater,

        subnetInflater,
        firewallInflater,
        accessPointInflater,
        desktopInflater,
        printerInflater,
        mfuInflater,
        scannerInflater
    ],
    
    async inflate(message: IMessageShape) {
        let result: IShape | null = null;
        await this.inflaters.every(async inflater => {
            const shape: IShape | null = await inflater(message);
            if (!shape) {
                return false;
            }
            result = shape;
            return true;
        });
        return result;
    }
}