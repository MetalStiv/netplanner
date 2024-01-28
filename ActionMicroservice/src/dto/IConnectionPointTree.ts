export interface IConnectionAddress {
    shapeId: string,
    pointId: string
};

export interface IConnectionPointTree {
    id: string,
    type: string,
    connectedShapes: IConnectionAddress[] | null
}
