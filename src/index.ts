import "reflect-metadata";
import express from "express";
import container from "./framework/inversify.config";
import * as http from 'http';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import debug from 'debug';
import { InversifyExpressServer, interfaces, TYPE } from "inversify-express-utils";
import './controllers/PostsController';

import { IServerResponse } from './framework/IServerResponse';

const app: express.Application = express();
const port = process.env.PORT ?? 3000;
const debugLog: debug.IDebugger = debug('app');

// here we are adding middleware to parse all incoming requests as JSON
app.use(express.json());

// here we are adding middleware to allow cross-origin requests
app.use(cors());

// here we are preparing the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
};

if (!process.env.DEBUG) {
    loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

// define a default route handler
app.get("/", (request: express.Request, response: express.Response ) => {
    return response.status(404).send({
    	message: 'No route found!',
    	status: 404
    } as IServerResponse);
});

const server = new InversifyExpressServer(container, null, { rootPath: "/api/v1" }, app);
const appConfigured = server.build();
appConfigured.listen(port, () => `App running on ${port}`);

export default app;