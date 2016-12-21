import bodyParser from 'body-parser';
import express from 'express';
import jwt from 'jsonwebtoken';
import requiredToken from './middleware/required-token';
import userService from '../services/user-service';

module.exports = (app, config) => {
    'use strict';

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    let router = express.Router();

    // middleware to use for all requests
    router.use((req, res, next) => {
        // do logging
        next();
    });

    router.get('/', (req, res) => {
        res.send('The API is at http://url/api');
    });

    router.post('/setup', (req, res) => {
       userService.setupAdminUser().then(user => {
            return res.json({
                success: true,
                user
            });
        })
        .catch(err => {
            res.status(500).json({
                 success: false,
                 err
            });
        });
    });

    router.post('/auth', (req, res) => {
        userService.authentication(req.body.email, req.body.password)
            .then(token => {
                return res.json({
                    success: true,
                    token
                });
            })
            .catch(err => {
                return res.status(500).json({
                        success: false,
                        err
                    });
            });
    });

    router.get('/users', (req, res) => {
        userService.getUserByFilter({})
            .then(users => {
                return res.status(200).json({
                    success: true,
                    users
                });
            })
            .catch(err => {
                res.status(500).json({
                    success: false,
                    err
                });
            });
    });

    router.get('/user/:id', (req, res) => {
        if(!req.params.id) {
            res.status(403).json({
                success: false,
                err: 'Id could not be null'
            });
        }

        userService.getUserById(req.params.id)
            .then(user => {
                return res.json({
                    success: true,
                    user
                });
            })
            .catch(err => {
                res.status(500).json({
                    success: false,
                    err
                });
            });
    });

    router.post('/user', (req, res) => {
        userService.createNewUser(req.body.user)
            .then(user => {
                return res.json({
                    success: true,
                    user
                });
            })
            .catch(err => {
                res.status(500).json({
                    success: false,
                    err
                });
            });
    });

    router.put('/user', (req, res) => {
        userService.updateUser(req.body.user._id, req.body.user)
            .then(user => {
                if(user) {
                    return res.json({
                        success: true,
                        user
                    });
                } else {
                    throw( 'User not found' );
                };
            })
            .catch(err => {
                res.status(500).json({
                    success: false,
                    err
                });
            });
    });

    router.put('/userpassword/:id', (req, res) => {
        const newUserPassword = {
            userId: req.params.id, 
            currentPassword: req.body.currentPassword, 
            newPassword: req.body.newPassword
        };

        userService.updateUserPassword(newUserPassword)
            .then(user => {
                return res.json({
                    success: true,
                    user    
                });
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    err
                });
            });
    });

    router.delete('/user/:id', (req, res) => {
        userService.deleteUser(req.params.id)
            .then(user => {
                return res.json({
                    success: true,
                    user
                });
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    err
                });
            });
    });

    const options = { publicKey: config.token.publicKey, ignoredRoutes: ['/api/auth', '/api/setup', '/api'] };
    const validToken = (token, cb) => {
        if (token) {
            jwt.verify(token, options.publicKey, (err, decoded) => {
                if (err) {
                    return cb('Failed to authenticate token');
                } else {
                    return cb(null, decoded);
                }
            });
        } else {
            return cb('Token is required.');
        }
    };

    app.use(requiredToken(options, validToken));

    app.use('/api', router);
};
