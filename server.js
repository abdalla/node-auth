import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

import apiController from'./server/api-controller';

import config from './config';


const app = express();
const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 3000;

//mongoose configuration
mongoose.connect(config.database);

//secret configuration
app.set('superSecret', config.secret);

//morgan configuration
app.use(morgan('dev'));

//routes configuration
app.use('/assets', express.static(`${__dirname}/public`));
apiController(app);

const server = app.listen(port, () => {
    console.log(`App listening at http://${server.address().address}:${server.address().port}`);
});

module.exports = server;