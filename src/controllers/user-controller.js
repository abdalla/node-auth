import bodyParser from 'body-parser';
import express from 'express';
import jwt from 'jsonwebtoken';
import requiredToken from './middleware/required-token';
import User from '../models/user';

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
        res.send('The API is at http://url/api');
    });

    router.get('/users', (req, res) => {
        User.find({}).then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                err
            });
        });
    });

    router.post('/auth', (req, res) => {
        const filter = { email: req.body.email };

        User.findOne(filter).then(user => {
           if (!user || !user.validPassword(req.body.password)) {
                res.json({ success: false, message: 'Authentication failed, email or password invalid.', token: null });
            } else {
                const token = jwt.sign(user, config.token.publicKey, {
                    expiresIn: config.token.expires.oneDay
                });

                res.json({
                    success: true,
                    message: 'enjoy',
                    token
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                 success: false,
                 err
            });
        });
    });

    router.post('/user', (req, res) => {
        let user = new User( req.body.user );

        user.save().then(user => {
            res.json({
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
        let toSave = new User( req.body.user );

        User.findByIdAndUpdate(req.body.user._id, toSave, {new: true, runValidators: true}).then(user => {
            if(user) {
                res.json({
                    success: true,
                    user: user
                });
            } else {
                res.status(500).json({
                    success: false,
                    err: 'User not found'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                err
            });
        });
    });

    router.delete('/user/:id', (req, res) => {

        User.findByIdAndRemove(req.params.id, { passRawResult:  true }).then(user => {
            if(user) {
                res.json({
                    success: true,
                    user: user
                });
            } else {
                res.status(500).json({
                    success: false,
                    err: 'User not found'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                err
            });
        });
    });

    router.get('/setup', (req, res) => {
        const user = new User({
            name: 'Admin',
            userName: 'admin',
            password: 'admin',
            email: 'admin@node.com',
            admin: true
        });

        user.save().then(user => {
            res.json({
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

    const options = { publicKey: config.token.publicKey, ignoredRoutes: ['/api/auth', '/api/setup'] };
    const validToken = (token, cb) => {
        if (token) {
            jwt.verify(token, options.publicKey, function(err, decoded) {
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
