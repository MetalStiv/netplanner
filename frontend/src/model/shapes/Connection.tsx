import ICoords from "../../common/model/ICoords";

export enum ConnectionTypes {
    STRAIGHT = 'straight',
}

// export interface IConnection {
//     type: ConnectionTypes,
//     firstShape: string,
//     secondShape: string
//     startCoords: { x: number, y: number },
//     endCoords: { x: number, y: number },
//     render: ()=>JSX.Element
// }

class Connection {
    type: ConnectionTypes = ConnectionTypes.STRAIGHT;
    // firstShape: string | null = null;
    // secondShape: string | null = null;
    startCoords: ICoords | null = null;
    endCoords: ICoords | null = null;

    constructor(startCoords: ICoords, endCoords: ICoords) {
        this.startCoords = startCoords;
        this.endCoords = endCoords;
    };

    renderStraightLine() {
        return <line
            x1={this.startCoords?.x}
            x2={this.endCoords?.x}
            y1={this.startCoords?.y}
            y2={this.endCoords?.y}
            stroke="black"
            strokeWidth={2}
        />
    };


    render() {
        switch (this.type) {
            case ConnectionTypes.STRAIGHT:
                return this.renderStraightLine()
            default:
                break;
        }
    };
};

export default Connection;