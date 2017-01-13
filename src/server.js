'use strict';
import express from 'express';
import morgan from 'morgan';
import config from './config';
import apiController from './controllers/api-controller';
import db from './db';

const app = express();
const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 3000;



//morgan configuration
app.use(morgan('dev', {
    skip: () => {
        return env === 'test';
    }
}));

apiController(app, config);

const dbConnect = () => {
    if (env !== 'test') {
        db.init();
        db.connect(config.database);
    }
};

dbConnect();

const server = app.listen(port);

const stopServer = () => {
    server.close();
};

server.on('close', function () {
    db.disconnect();
});

// listen for TERM signal .e.g. kill
process.on('SIGTERM', function () {
    stopServer();
});

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', function () {
    stopServer();
});


module.exports = {
    server,
    stopServer
};