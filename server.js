import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import config from './config';
import apiController from'./server/api-controller';

const app = express();
const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 3001;

if(env !== 'test') {
    mongoose.connect(config.database);
}

//secret configuration
app.set('superSecret', config.token.secret);

//morgan configuration
app.use(morgan('dev'));

//routes configuration
app.use('/assets', express.static(`${__dirname}/public`));
apiController(app, config);

const server = app.listen(port, () => {
    console.log(`App listening at http://localhos:${server.address().port}`);
});

module.exports = server;