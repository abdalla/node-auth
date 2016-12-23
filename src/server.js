'use strict';
import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import config from './config';
import apiController from './controllers/api-controller';

const app = express();
const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 3000;

mongoose.Promise = bluebird;

//morgan configuration
app.use(morgan('dev', {
    skip: () => { 
        return env === 'test'; 
    }
}));

apiController(app, config);

const server = app.listen(port, () => {
    if (env !== 'test') {
        mongoose.connect(config.database);
        
        //console.log(`App listening at http://localhos:${server.address().port}`);
    }
});

module.exports = server;