import * as http from 'http'; 
import * as mongoDB from "mongodb";
import actionHandlers from './actionHandlers/actionHandlers';
import { ILayer } from './model/ILayer';
import { IPage } from './model/IPage';
import { IProject } from './model/IProject';
import { IShape } from './model/IShape';

require('dotenv').config();
const PORT: string = process.env.PORT;
const DB_CONNECTION_STRING: string = process.env.DB_CONNECTION_STRING;
const DB_NAME: string = process.env.DB_NAME;
const DB_PROJECT_COLLECTION_NAME: string = process.env.DB_PROJECT_COLLECTION_NAME;
const DB_PAGE_COLLECTION_NAME: string = process.env.DB_PAGE_COLLECTION_NAME;
const DB_LAYER_COLLECTION_NAME: string = process.env.DB_LAYER_COLLECTION_NAME;
const DB_SHAPE_COLLECTION_NAME: string = process.env.DB_SHAPE_COLLECTION_NAME;

const WebSocket = require('ws');
const wsServer = new WebSocket.Server({ port: PORT });

const jwt = require('jsonwebtoken');
const fs = require('fs');

const mongoClient = new mongoDB.MongoClient(DB_CONNECTION_STRING);
const mongoDatabase: mongoDB.Db = mongoClient.db(DB_NAME);

export interface IDatadaseCollections {
    projectCollection: mongoDB.Collection<IProject>,
    pageCollection: mongoDB.Collection<IPage>,
    layerCollection: mongoDB.Collection<ILayer>,
    shapeCollection: mongoDB.Collection<IShape>
}

const collections: IDatadaseCollections = {
    projectCollection: mongoDatabase.collection<IProject>(DB_PROJECT_COLLECTION_NAME),
    pageCollection: mongoDatabase.collection<IPage>(DB_PAGE_COLLECTION_NAME),
    layerCollection: mongoDatabase.collection<ILayer>(DB_LAYER_COLLECTION_NAME),
    shapeCollection: mongoDatabase.collection<IShape>(DB_SHAPE_COLLECTION_NAME),
}

interface IMetadata {
    userId: string,
    projectId: string
}

export interface IMessage {
    type: string,
    senderId?: string,
    projectId?: string,
    pageId?: string,
    layerId?: string,
    data: {
        id?: string,
        shape?: string, 
        dropCoords?: { x: number, y: number }
    },
}

const clients = new Map<WebSocket, IMetadata>();
const publicKey = fs.readFileSync("/app/RsaKeys/public.pem", "utf8");

wsServer.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    let queryData = require('url').parse(req.url, true).query;
    let token: string = queryData.token;
    let projectId: string = queryData.projectId;

    if (!projectId || projectId === ""){
        ws.close()
    }

    let userId: string = '';
    jwt.verify(token, publicKey, (err, decoded) => {
        if (err) {
            ws.close();
        } else {
            userId = decoded.Id;
        }
    });

    const metadata: IMetadata = { userId, projectId };
    clients.set(ws, metadata);

    ws.onmessage = function(event: MessageEvent){
        const message: IMessage = JSON.parse(event.data);
        message.senderId = clients.get(ws).userId;
        message.projectId = clients.get(ws).projectId;

        console.log(message);

        const isHandled = actionHandlers.handle(collections, message)
        if (!isHandled){
            return;
        }

        const outbound = JSON.stringify(message);
        [...clients].forEach(([ws, metadata]: [WebSocket, IMetadata]) => {
            (metadata.projectId === clients.get(ws).projectId) && ws.send(outbound);
        });
    }

    ws.onclose = function() {
        clients.delete(ws);
    }
})
