'use strict';
import bodyParser from 'body-parser';
import express from 'express';
import userController from'./user-controller';

module.exports = (app, config) => {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    let router = express.Router();

    //routes configuration
    app.use('/assets', express.static(`${__dirname}/public`));  

    // middleware to use for all requests
    router.use((req, res, next) => {
        // do logging
        next();
    });

    userController(app, config);

    router.get('/', (req, res) => {
        res.send('The API is at http://url/api');
    });

    app.use('/api', router);
};
