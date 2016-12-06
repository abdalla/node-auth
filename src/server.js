'use strict';

import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import config from './config';
import userController from'./controllers/user-controller';

const app = express();
const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 3000;

//secret configuration
//app.set('publicKey', config.token.publicKey);

//morgan configuration
app.use(morgan('dev', {
    skip: function(req, res) { return env === 'test'; }
}));

//routes configuration
app.use('/assets', express.static(`${__dirname}/public`));
userController(app, config);

const server = app.listen(port, () => {
    if(env !== 'test') {
        mongoose.connect(config.database);
        mongoose.Promise = bluebird;

        console.log(`App listening at http://localhos:${server.address().port}`);
    }
});

module.exports = server;