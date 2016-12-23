'use strict';
import bodyParser from 'body-parser';
import express from 'express';
import jwt from 'jsonwebtoken';
import requiredToken from './middleware/required-token';
import userController from './user-controller';

module.exports = (app, config) => {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    let router = express.Router();

    // HACK: middleware to use for all requests
    router.use((req, res, next) => {
        // do logging
        next();
    });

    //routes configuration
    app.use('/assets', express.static(`${__dirname}/public`));  

    // middleware to use for all requests
    router.use((req, res, next) => {
        // do logging
        next();
    });

    router.get('/', (req, res) => {
        res.send('The API is at http://url/api');
    });

    const options = { publicKey: config.token.publicKey, ignoredRoutes: ['/api/auth', '/api/setup', '/api'] };
    const validToken = (token, cb) => {
        jwt.verify(token, options.publicKey, (err, decoded) => {
            if (err) {
                return cb('Failed to authenticate token');
            } else {
                return cb(null, decoded);
            }
        });
    };
    app.use(requiredToken(options, validToken));
    
    userController(app, router, config);
    app.use('/api', router);
};
