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
    router.use((req, res, next) => {
        // do logging
        console.log('Something is happening.');
        next(); // make sure we go to the next routes and don't stop here
    });

    router.get('/', (req, res) => {
        res.send('Hello! The API is at http://localhost:/api');
    });

    router.post('/user', (req, res) => {
        res.send(req.body);
    });
 

    app.use('/api', router);
};
