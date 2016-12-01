import express from 'express';
import morgan from 'morgan';
import mongoose from 'mongoose';
import config from './config';
import apiController from'./server/api-controller';

const app = express();
const env = process.env.NODE_ENV || 'dev';
const port = process.env.PORT || 3001;

//secret configuration
app.set('superSecret', config.token.secret);

//morgan configuration
app.use(morgan('dev', {
    skip: function(req, res) { return env === 'test'; }
}));

//routes configuration
app.use('/assets', express.static(`${__dirname}/public`));
apiController(app, config);

const server = app.listen(port, () => {
    if(env !== 'test') {
        console.log(`App listening at http://localhos:${server.address().port}`);
        mongoose.connect(config.database);
    }
});

module.exports = server;