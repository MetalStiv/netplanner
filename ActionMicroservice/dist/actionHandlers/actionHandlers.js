"use strict";
exports.__esModule = true;
exports.actionHandlers = void 0;
var addLayerHandler_1 = require("./addLayerHandler");
var addPageHandler_1 = require("./addPageHandler");
var addShapeHandler_1 = require("./addShapeHandler");
var changeGraphicalPropertiesHandler_1 = require("./changeGraphicalPropertiesHandler");
var cursorPositionHandler_1 = require("./cursorPositionHandler");
var deleteShapeAction_1 = require("./deleteShapeAction");
var changeLayerVisible_1 = require("./changeLayerVisible");
var renameLayer_1 = require("./renameLayer");
var renamePage_1 = require("./renamePage");
var deleteLayerHandler_1 = require("./deleteLayerHandler");
var deletePageHandler_1 = require("./deletePageHandler");
exports.actionHandlers = {
    handlers: new Array(cursorPositionHandler_1.cursorPositionHandler, addShapeHandler_1.addShapeHandler, deleteShapeAction_1.deleteShapeHandler, addLayerHandler_1.addLayerHandler, renameLayer_1.renameLayerHandler, deleteLayerHandler_1.deleteLayerHandler, changeLayerVisible_1.changeLayerVisibleHandler, addPageHandler_1.addPageHandler, renamePage_1.renamePageHandler, deletePageHandler_1.deletePageHandler, changeGraphicalPropertiesHandler_1.changeGraphicalPropertiesHandler),
    handle: function (collections, message) {
        return Promise.allSettled(this.handlers.map(function (handler) { return handler(collections, message); })).then(function (results) {
            var fulfilledResult = results.find(function (result) { return result.status === "fulfilled"; });
            return fulfilledResult.status === "fulfilled" ? fulfilledResult.value : {};
        });
    }
};
exports["default"] = exports.actionHandlers;
