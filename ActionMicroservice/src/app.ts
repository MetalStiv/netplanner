import * as http from 'http';
import * as mongoDB from "mongodb";
import actionHandlers from './actionHandlers/actionHandlers';
import { ActionType } from './actionType';
import { ILayerTree } from './dto/ILayerTree';
import { IMessage } from './dto/IMessage';
import { IPageTree } from './dto/IPageTree';
import { IShapeTree } from './dto/IShapeTree';
import { ILayer } from './model/ILayer';
import { IPage } from './model/IPage';
import { IProjectMeta } from './model/IProjectMeta';
import { IShape } from './model/IShape';

require('dotenv').config();
const PORT: string = process.env.PORT;
const DB_CONNECTION_STRING: string = process.env.DB_CONNECTION_STRING;
const DB_NAME: string = process.env.DB_NAME;
const DB_PAGE_COLLECTION_NAME: string = process.env.DB_PAGE_COLLECTION_NAME;
const DB_LAYER_COLLECTION_NAME: string = process.env.DB_LAYER_COLLECTION_NAME;
const DB_SHAPE_COLLECTION_NAME: string = process.env.DB_SHAPE_COLLECTION_NAME;
const DB_PROJECT_META_COLLECTION_NAME: string = process.env.DB_PROJECT_META_COLLECTION_NAME;

const WebSocket = require('ws');
const wsServer = new WebSocket.Server({ port: PORT });

const jwt = require('jsonwebtoken');
const fs = require('fs');

const mongoClient = new mongoDB.MongoClient(DB_CONNECTION_STRING);
const mongoDatabase: mongoDB.Db = mongoClient.db(DB_NAME);

export interface IDatadaseCollections {
    pageCollection: mongoDB.Collection<IPage>,
    layerCollection: mongoDB.Collection<ILayer>,
    shapeCollection: mongoDB.Collection<IShape>,
    projectMetaCollection: mongoDB.Collection<IProjectMeta>,
}

const collections: IDatadaseCollections = {
    pageCollection: mongoDatabase.collection<IPage>(DB_PAGE_COLLECTION_NAME),
    layerCollection: mongoDatabase.collection<ILayer>(DB_LAYER_COLLECTION_NAME),
    shapeCollection: mongoDatabase.collection<IShape>(DB_SHAPE_COLLECTION_NAME),
    projectMetaCollection: mongoDatabase.collection<IProjectMeta>(DB_PROJECT_META_COLLECTION_NAME),
}

interface IMetadata {
    userId: string,
    projectId: string
}

const clients = new Map<WebSocket, IMetadata>();
const publicKey = fs.readFileSync("/app/RsaKeys/public.pem", "utf8");

wsServer.on('connection', async (ws: WebSocket, req: http.IncomingMessage) => {
    let queryData = require('url').parse(req.url, true).query;
    
    let token: string = queryData.token;
    let projectId: string = queryData.projectId;

    if (!projectId || projectId === "" || projectId === "undefined") {
        ws.close();
        return;
    }

    let userId: string = '';
    jwt.verify(token, publicKey, (err, decoded) => {
        if (err) {
            ws.close();
        } else {
            userId = decoded.Id;
        }
    });

    // check user rights!

    const metadata: IMetadata = { userId, projectId };
    clients.set(ws, metadata);
    console.log("Socs");
    clients.forEach((meta, w) => {
        console.log(meta)
    });

    const pageFilter: mongoDB.Filter<IPage> = { "projectId": new mongoDB.ObjectId(projectId) };
    const pages: IPage[] = await (collections.pageCollection.find(pageFilter)).toArray();
    const pageTrees: IPageTree[] = await Promise.all(pages.map(async p => {
        const layerFilter: mongoDB.Filter<ILayer> = { "pageId": new mongoDB.ObjectId(p._id) };
        const layers: ILayer[] = await (collections.layerCollection.find(layerFilter)).toArray();
        const layerTrees: ILayerTree[] = await Promise.all(layers.map(async l => {
            const shapeFilter: mongoDB.Filter<IShape> = { "layerId": new mongoDB.ObjectId(l._id) };
            const shapes: IShape[] = await (collections.shapeCollection.find(shapeFilter)).toArray();
            const shapeTrees: IShapeTree[] = shapes.map(s => ({
                id: s._id.toString(),
                type: s.type,
                zIndex: s.zIndex,
                graphicalProperties: s.graphicalProperties
            }))
            return {
                id: l._id.toString(),
                name: l.name,
                shapes: shapeTrees,
                zIndex: l.zIndex
            }
        }))
        return {
            id: p._id.toString(),
            name: p.name,
            layers: layerTrees
        }
    }));

    const sendMessage: IMessage = {
        type: ActionType.OPEN_PROJECT,
        data: {
            pages: pageTrees
        }
    };

    ws.send(JSON.stringify(sendMessage));

    ws.onmessage = function (event: MessageEvent) {
        let message: IMessage = JSON.parse(event.data);
        message.senderId = clients.get(ws).userId;
        message.projectId = clients.get(ws).projectId;

        actionHandlers.handle(collections, message).then(response => {
            if (!response) {
                return;
            }
            const outbound = JSON.stringify(response);
            [...clients].forEach(([ws, metadata]: [WebSocket, IMetadata]) => {
                (metadata.projectId === clients.get(ws).projectId) && ws.send(outbound);
            });
        })
    }

    ws.onclose = function () {
        clients.delete(ws);
    }

    ws.onerror = (e: Event) => {
        console.log(e);
    }
})
