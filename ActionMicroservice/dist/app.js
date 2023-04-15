"use strict";
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
require('dotenv').config();
var PORT = process.env.PORT;
var DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
var DB_NAME = process.env.DB_NAME;
var DB_PROJECT_COLLECTION_NAME = process.env.DB_PROJECT_COLLECTION_NAME;
var DB_PAGE_COLLECTION_NAME = process.env.DB_PAGE_COLLECTION_NAME;
var DB_LAYER_COLLECTION_NAME = process.env.DB_LAYER_COLLECTION_NAME;
var DB_SHAPE_COLLECTION_NAME = process.env.DB_SHAPE_COLLECTION_NAME;
var WebSocket = require('ws');
var wsServer = new WebSocket.Server({ port: PORT });
var jwt = require('jsonwebtoken');
var fs = require('fs');
var mongoClient = new mongoDB.MongoClient(DB_CONNECTION_STRING);
var mongoDatabase = mongoClient.db(DB_NAME);
var collections = {
    projectCollection: mongoDatabase.collection(DB_PROJECT_COLLECTION_NAME),
    pageCollection: mongoDatabase.collection(DB_PAGE_COLLECTION_NAME),
    layerCollection: mongoDatabase.collection(DB_LAYER_COLLECTION_NAME),
    shapeCollection: mongoDatabase.collection(DB_SHAPE_COLLECTION_NAME)
};
var clients = new Map();
var publicKey = fs.readFileSync("/app/RsaKeys/public.pem", "utf8");
wsServer.on('connection', function (ws, req) {
    var queryData = require('url').parse(req.url, true).query;
    var token = queryData.token;
    var projectId = queryData.projectId;
    if (!projectId || projectId === "") {
        ws.close();
    }
    var userId = '';
    jwt.verify(token, publicKey, function (err, decoded) {
        if (err) {
            ws.close();
        }
        else {
            userId = decoded.Id;
        }
    });
    var metadata = { userId: userId, projectId: projectId };
    clients.set(ws, metadata);
    ws.onmessage = function (event) {
        var message = JSON.parse(event.data);
        message.senderId = clients.get(ws).userId;
        message.projectId = clients.get(ws).projectId;
        console.log(message);
        var isHandled = actionHandlers_1["default"].handle(collections, message);
        if (!isHandled) {
            return;
        }
        var outbound = JSON.stringify(message);
        __spreadArray([], __read(clients), false).forEach(function (_a) {
            var _b = __read(_a, 2), ws = _b[0], metadata = _b[1];
            (metadata.projectId === clients.get(ws).projectId) && ws.send(outbound);
        });
    };
    ws.onclose = function () {
        clients["delete"](ws);
    };
});
