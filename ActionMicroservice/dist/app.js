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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var mongoDB = require("mongodb");
var actionHandlers_1 = require("./actionHandlers/actionHandlers");
var actionType_1 = require("./actionType");
require('dotenv').config();
var PORT = process.env.PORT;
var DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
var DB_NAME = process.env.DB_NAME;
var DB_PAGE_COLLECTION_NAME = process.env.DB_PAGE_COLLECTION_NAME;
var DB_LAYER_COLLECTION_NAME = process.env.DB_LAYER_COLLECTION_NAME;
var DB_SHAPE_COLLECTION_NAME = process.env.DB_SHAPE_COLLECTION_NAME;
var DB_PROJECT_META_COLLECTION_NAME = process.env.DB_PROJECT_META_COLLECTION_NAME;
var WebSocket = require('ws');
var wsServer = new WebSocket.Server({ port: PORT });
var jwt = require('jsonwebtoken');
var fs = require('fs');
var mongoClient = new mongoDB.MongoClient(DB_CONNECTION_STRING);
var mongoDatabase = mongoClient.db(DB_NAME);
var collections = {
    pageCollection: mongoDatabase.collection(DB_PAGE_COLLECTION_NAME),
    layerCollection: mongoDatabase.collection(DB_LAYER_COLLECTION_NAME),
    shapeCollection: mongoDatabase.collection(DB_SHAPE_COLLECTION_NAME),
    projectMetaCollection: mongoDatabase.collection(DB_PROJECT_META_COLLECTION_NAME)
};
var clients = new Map();
var publicKey = fs.readFileSync("/app/RsaKeys/public.pem", "utf8");
wsServer.on('connection', function (ws, req) { return __awaiter(void 0, void 0, void 0, function () {
    var queryData, token, projectId, userId, metadata, pageFilter, pages, pageTrees, sendMessage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                queryData = require('url').parse(req.url, true).query;
                token = queryData.token;
                projectId = queryData.projectId;
                if (!projectId || projectId === "" || projectId === "undefined") {
                    ws.close();
                    return [2 /*return*/];
                }
                userId = '';
                jwt.verify(token, publicKey, function (err, decoded) {
                    if (err) {
                        ws.close();
                    }
                    else {
                        userId = decoded.Id;
                    }
                });
                metadata = { userId: userId, projectId: projectId };
                clients.set(ws, metadata);
                console.log("Socs");
                clients.forEach(function (meta, w) {
                    console.log(meta);
                });
                pageFilter = { "projectId": new mongoDB.ObjectId(projectId) };
                return [4 /*yield*/, (collections.pageCollection.find(pageFilter)).toArray()];
            case 1:
                pages = _a.sent();
                return [4 /*yield*/, Promise.all(pages.map(function (p) { return __awaiter(void 0, void 0, void 0, function () {
                        var layerFilter, layers, layerTrees;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    layerFilter = { "pageId": new mongoDB.ObjectId(p._id) };
                                    return [4 /*yield*/, (collections.layerCollection.find(layerFilter)).toArray()];
                                case 1:
                                    layers = _a.sent();
                                    return [4 /*yield*/, Promise.all(layers.map(function (l) { return __awaiter(void 0, void 0, void 0, function () {
                                            var shapeFilter, shapes, shapeTrees;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        shapeFilter = { "layerId": new mongoDB.ObjectId(l._id) };
                                                        return [4 /*yield*/, (collections.shapeCollection.find(shapeFilter)).toArray()];
                                                    case 1:
                                                        shapes = _a.sent();
                                                        shapeTrees = shapes.map(function (s) { return ({
                                                            id: s._id.toString(),
                                                            type: s.type,
                                                            zIndex: s.zIndex,
                                                            graphicalProperties: s.graphicalProperties
                                                        }); });
                                                        return [2 /*return*/, {
                                                                id: l._id.toString(),
                                                                name: l.name,
                                                                shapes: shapeTrees,
                                                                zIndex: l.zIndex,
                                                                isVisible: l.isVisible
                                                            }];
                                                }
                                            });
                                        }); }))];
                                case 2:
                                    layerTrees = _a.sent();
                                    return [2 /*return*/, {
                                            id: p._id.toString(),
                                            name: p.name,
                                            layers: layerTrees
                                        }];
                            }
                        });
                    }); }))];
            case 2:
                pageTrees = _a.sent();
                sendMessage = {
                    type: actionType_1.ActionType.OPEN_PROJECT,
                    data: {
                        pages: pageTrees
                    }
                };
                ws.send(JSON.stringify(sendMessage));
                ws.onmessage = function (event) {
                    var message = JSON.parse(event.data);
                    message.senderId = clients.get(ws).userId;
                    message.projectId = clients.get(ws).projectId;
                    actionHandlers_1["default"].handle(collections, message).then(function (response) {
                        if (!response) {
                            return;
                        }
                        var outbound = JSON.stringify(response);
                        __spreadArray([], __read(clients), false).forEach(function (_a) {
                            var _b = __read(_a, 2), ws = _b[0], metadata = _b[1];
                            (metadata.projectId === clients.get(ws).projectId) && ws.send(outbound);
                        });
                    });
                };
                ws.onclose = function () {
                    clients["delete"](ws);
                };
                ws.onerror = function (e) {
                    console.log(e);
                };
                return [2 /*return*/];
        }
    });
}); });
