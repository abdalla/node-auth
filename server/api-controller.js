import bodyParser from 'body-parser';
import express from 'express';
import jwt from 'jsonwebtoken';

import User from '../app/models/user';

module.exports = (app, config) => {

    //bodyParser configuration
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // get an instance of the express Router
    let router = express.Router();

    // middleware to use for all requests
    router.use((req, res, next) => {
        // do logging
        //console.log('Something is happening.');
        next(); // make sure we go to the next routes and don't stop here
    });

    router.get('/', (req, res) => {
        res.send('Hello! The API is at http://localhost:/api');
    });

    router.get('/users', (req, res) => {
        User.find({}, (err, users) => {
            res.json(users);
        });
    });

    router.post('/auth', (req, res) => {
        const filter = { email: req.body.email };

        User.findOne(filter, (err, user) => {
            if (err) throw err;

           if (!user || user.password !== req.body.password ) {
                res.json({ success: false, message: 'Authentication failed, email or password invalid.' });
            } else {
                const token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn: config.token.expires.oneDay
                });

                res.json({
                    success: true,
                    message: 'enjoy',
                    token
                });
            }
        });
    });

    router.post('/user', (req, res) => {
       const user = new User({
            name: req.body.user.name,
            userName: req.body.user.userName,
            password: req.body.user.password,
            email: req.body.user.email,
            admin: req.body.user.admin
        });

        user.save(err => {
             if(err) throw err;

             res.json({ 
                 success: true,
                 user
            });
        });
    });


    router.get('/setup', (req, res) => {
        const user = new User({
            name: 'Carlos Abdalla',
            userName: 'abdalla',
            password: 'abdallah',
            email: 'a@b.com',
            admin: true
        });
        
        user.save(err => {
             if(err) throw err;

             res.json({ success: true });
        });

    });

    app.use('/api', router);
};
