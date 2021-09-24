import http from 'http';
import express, { response } from 'express';
import bodyParser from 'body-parser';
import logging from './config/logging';
import config from './config/config';
import { httpCodes } from '../models';
import sampleRoutes from './routes/routes';

const NAMESPACE = 'Server';
const router = express();

/** Logging the request */
router.use((req, res, next) => {
    logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`);

    res.on('finish', () => {
        logging.info(NAMESPACE, `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`);
    });

    next();
});

/** Parse the request */
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/** Rules of API */
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, MauricioCV');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Nethods', 'GET PATCH DELETE POST PUT');
        return res.status(httpCodes.HttpOK).json({});
    }

    next();
});

/** Routes */
router.use('/api', sampleRoutes);

/** Error Handling */
router.use((req, res, next) => {
    const error = new Error('not found');

    return res.status(httpCodes.HttpNotFound).json({
        message: error.message
    });
});

/** Create the server */

const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () => logging.info(NAMESPACE, `Server running on ${config.server.hostname}:${config.server.port}`));
