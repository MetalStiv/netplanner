"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.addPageHandler = void 0;
var mongodb_1 = require("mongodb");
var actionType_1 = require("../actionType");
var titleUniqueization_1 = require("../helpers/titleUniqueization");
var addPageHandler = function (collections, message) { return __awaiter(void 0, void 0, void 0, function () {
    function uniqPageTitle(name) {
        return (0, titleUniqueization_1.titleUniqueization)({ title: name.length ? name : 'Page', collection: collections.pageCollection,
            parentField: 'projectId', parentId: message.projectId });
    }
    var uniqTitle, newPage, messageCopy, newLayers, newShapes, objId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (message.type !== actionType_1.ActionType.ADD_PAGE) {
                    return [2 /*return*/, Promise.reject('Wrong handler')];
                }
                return [4 /*yield*/, uniqPageTitle(message.data.newPage.name)];
            case 1:
                uniqTitle = _a.sent();
                newPage = {
                    _id: message.data.newPage.id ? new mongodb_1.ObjectId(message.data.newPage.id) : new mongodb_1.ObjectId(),
                    name: message.data.newPage.name || uniqTitle,
                    projectId: new mongodb_1.ObjectId(message.projectId)
                };
                messageCopy = JSON.parse(JSON.stringify(message));
                messageCopy.data.newPage.id = newPage._id.toString();
                messageCopy.data.newPage.name = newPage.name;
                newLayers = [];
                newShapes = [];
                if (messageCopy.data.newPage.layers && messageCopy.data.newPage.layers.length) {
                    newLayers.push(messageCopy.data.newPage.layers.map(function (layer) {
                        var layerObjId = new mongodb_1.ObjectId();
                        layer.id = layerObjId.toString();
                        newShapes.push(layer.shapes.map(function (shape) {
                            var shapeObjId = new mongodb_1.ObjectId();
                            shape.id = shapeObjId.toString();
                            return {
                                _id: shapeObjId,
                                type: shape.type,
                                layerId: layerObjId,
                                zIndex: shape.zIndex,
                                graphicalProperties: shape.graphicalProperties
                            };
                        }));
                        return {
                            _id: layerObjId,
                            name: layer.name,
                            pageId: new mongodb_1.ObjectId(messageCopy.data.newPage.id),
                            zIndex: layer.zIndex,
                            isVisible: layer.isVisible
                        };
                    }));
                }
                else {
                    objId = new mongodb_1.ObjectId();
                    newLayers = [{
                            _id: objId,
                            name: 'Layer',
                            pageId: new mongodb_1.ObjectId(messageCopy.data.newPage.id),
                            isVisible: true,
                            zIndex: 1
                        }];
                    messageCopy.data.newPage.layers = [{
                            name: newLayers[0].name,
                            id: objId.toString(),
                            zIndex: newLayers[0].zIndex,
                            isVisible: true,
                            shapes: []
                        }];
                }
                collections.pageCollection.insertOne(newPage);
                collections.layerCollection.insertMany(newLayers);
                newShapes.length && collections.shapeCollection.insertMany(newShapes);
                return [2 /*return*/, messageCopy];
        }
    });
}); };
exports.addPageHandler = addPageHandler;
