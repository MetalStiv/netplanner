export interface IActionTypes {
    ADD_PAGE: string,
    REMOVE_PAGE: string,
    RENAME_PAGE: string,

    ADD_LAYER: string,
    REMOVE_LAYER: string,
    RENAME_LAYER: string,

    ADD_SHAPE: string,
    CHANGE_GRAPHICAL_PROPERTY: string
}

export const ActionTypes: IActionTypes = {
    ADD_PAGE: "ADD_PAGE",
    REMOVE_PAGE: "REMOVE_PAGE",
    RENAME_PAGE: "RENAME_PAGE",

    ADD_LAYER: "ADD_LAYER",
    REMOVE_LAYER: "REMOVE_LAYER",
    RENAME_LAYER: "RENAME_LAYER",

    ADD_SHAPE: "ADD_SHAPE",
    CHANGE_GRAPHICAL_PROPERTY: "CHANGE_GRAPHICAL_PROPERTY"
}