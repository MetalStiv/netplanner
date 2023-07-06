import { interpolationSteps, cursorUpdateTime } from "../../common/constants";

class UserCursor {
    userId: string;
    pageId: string;
    coord: {
        x: number,
        y: number
    };
    prevCoord: {
        x: number,
        y: number
    };
    actionTime: number;
    color: string

    constructor(userId: string, pageId: string, coord: {x: number, y: number}) {
        this.userId = userId;
        this.pageId = pageId;
        this.coord = {x: coord.x, y: coord.y};
        this.prevCoord = {x: coord.x, y: coord.y};
        this.actionTime = Date.now();
        this.color = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
    }

    async moveCursor(coord: {x: number, y: number}){
        this.prevCoord.x = this.coord.x;
        this.prevCoord.y = this.coord.y;

        this.coord.x = coord.x;
        this.coord.y = coord.y;

        this.actionTime = Date.now();
    }
}

export default UserCursor;