import bodyParser from 'body-parser';
import express from 'express';

import User from '../app/models/user';

module.exports = (app) => {

    //bodyParser configuration
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // get an instance of the express Router
    let router = express.Router();              

    // middleware to use for all requests
    router.use(function(req, res, next) {
        // do logging
        console.log('Something is happening.');
        next(); // make sure we go to the next routes and don't stop here
    });

    app.get('/', function(req, res) {
        res.send('Hello! The API is at http://localhost:/api');
    });
 

    app.use('/api', router);
};
