"use strict";
exports.__esModule = true;
exports.actionHandlers = void 0;
var mongodb_1 = require("mongodb");
var addLayerHandler_1 = require("./addLayerHandler");
var addPageHandler_1 = require("./addPageHandler");
var addShapeHandler_1 = require("./addShapeHandler");
var changeGraphicalPropertiesHandler_1 = require("./changeGraphicalPropertiesHandler");
var cursorPositionHandler_1 = require("./cursorPositionHandler");
var deleteShapeAction_1 = require("./deleteShapeAction");
var changeLayerVisible_1 = require("./changeLayerVisible");
var renameLayer_1 = require("./renameLayer");
var renamePage_1 = require("./renamePage");
exports.actionHandlers = {
    handlers: new Array(cursorPositionHandler_1.cursorPositionHandler, addShapeHandler_1.addShapeHandler, deleteShapeAction_1.deleteShapeHandler, addLayerHandler_1.addLayerHandler, renameLayer_1.renameLayerHandler, changeLayerVisible_1.changeLayerVisibleHandler, addPageHandler_1.addPageHandler, renamePage_1.renamePageHandler, changeGraphicalPropertiesHandler_1.changeGraphicalPropertiesHandler),
    handle: function (collections, message) {
        collections.projectMetaCollection.findOneAndUpdate({
            _id: new mongodb_1.ObjectId(message.projectId)
        }, {
            $set: { lastModifyTime: new Date }
        });
        return Promise.allSettled(this.handlers.map(function (handler) { return handler(collections, message); })).then(function (results) {
            var fulfilledResult = results.find(function (result) { return result.status === "fulfilled"; });
            return fulfilledResult.status === "fulfilled" ? fulfilledResult.value : {};
        });
    }
};
exports["default"] = exports.actionHandlers;
