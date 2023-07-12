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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
exports.__esModule = true;
exports.addLayerHandler = void 0;
var mongodb_1 = require("mongodb");
var actionType_1 = require("../actionType");
var titleUniqueization_1 = require("../helpers/titleUniqueization");
var addLayerHandler = function (collections, message) { return __awaiter(void 0, void 0, void 0, function () {
    function uniqLayerTitle(name) {
        return (0, titleUniqueization_1.titleUniqueization)({ title: name.length ? name : 'Layer', collection: collections.layerCollection,
            parentField: 'pageId', parentId: message.pageId });
    }
    function getZIndex(pageId) {
        return __awaiter(this, void 0, void 0, function () {
            var count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, collections.layerCollection.countDocuments({ pageId: new mongodb_1.ObjectId(pageId) })];
                    case 1:
                        count = _a.sent();
                        return [2 /*return*/, count * 1000];
                }
            });
        });
    }
    var uniqTitle, zIndex, newLayer, _a, _b, s, newShape, e_1_1, messageCopy;
    var e_1, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                if (message.type !== actionType_1.ActionType.ADD_LAYER) {
                    return [2 /*return*/, Promise.reject('Wrong handler')];
                }
                collections.projectMetaCollection.findOneAndUpdate({
                    _id: new mongodb_1.ObjectId(message.projectId)
                }, {
                    $set: { lastModifyTime: new Date }
                });
                return [4 /*yield*/, uniqLayerTitle(message.data.newLayer.name)];
            case 1:
                uniqTitle = _d.sent();
                return [4 /*yield*/, getZIndex(message.pageId)];
            case 2:
                zIndex = _d.sent();
                newLayer = {
                    _id: message.data.newLayer.id ? new mongodb_1.ObjectId(message.data.newLayer.id) : new mongodb_1.ObjectId(),
                    name: message.data.newLayer.name || uniqTitle,
                    pageId: new mongodb_1.ObjectId(message.pageId),
                    zIndex: message.data.newLayer.zIndex || zIndex,
                    isVisible: message.data.newLayer.isVisible === undefined ? true
                        : message.data.newLayer.isVisible
                };
                return [4 /*yield*/, collections.layerCollection.insertOne(newLayer)];
            case 3:
                _d.sent();
                if (!message.data.newLayer.shapes) return [3 /*break*/, 16];
                _d.label = 4;
            case 4:
                _d.trys.push([4, 10, 11, 16]);
                _a = __asyncValues(message.data.newLayer.shapes);
                _d.label = 5;
            case 5: return [4 /*yield*/, _a.next()];
            case 6:
                if (!(_b = _d.sent(), !_b.done)) return [3 /*break*/, 9];
                s = _b.value;
                newShape = {
                    _id: new mongodb_1.ObjectId(s.id),
                    type: s.type,
                    layerId: new mongodb_1.ObjectId(message.data.newLayer.id),
                    zIndex: s.zIndex,
                    graphicalProperties: s.graphicalProperties
                };
                return [4 /*yield*/, collections.shapeCollection.insertOne(newShape)];
            case 7:
                _d.sent();
                _d.label = 8;
            case 8: return [3 /*break*/, 5];
            case 9: return [3 /*break*/, 16];
            case 10:
                e_1_1 = _d.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 16];
            case 11:
                _d.trys.push([11, , 14, 15]);
                if (!(_b && !_b.done && (_c = _a["return"]))) return [3 /*break*/, 13];
                return [4 /*yield*/, _c.call(_a)];
            case 12:
                _d.sent();
                _d.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 15: return [7 /*endfinally*/];
            case 16:
                messageCopy = JSON.parse(JSON.stringify(message));
                messageCopy.data.newLayer.id = newLayer._id.toString();
                messageCopy.data.newLayer.name = newLayer.name;
                messageCopy.data.newLayer.zIndex = newLayer.zIndex;
                return [2 /*return*/, messageCopy];
        }
    });
}); };
exports.addLayerHandler = addLayerHandler;
