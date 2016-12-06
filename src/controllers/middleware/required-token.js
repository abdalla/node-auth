"use strict"

const requiredToken =  ( options, tokenValidator ) => {
    return (req, res, next) => {

       if(!options.publicKey) throw 'publicKey is required';

        const ignoreRoute = ( options.ignoredRoutes || false ) && options.ignoredRoutes.some( route => route === req.originalUrl );

        if (!ignoreRoute) {
            var token = req.body.token || req.query.token || req.headers['x-access-token'];

            if(!token) {
                return res.status(403).send({
                    success: false,
                    message: 'Token is required.'
                });
            };

            tokenValidator(token, function(err, decoded) {
                if (err) {
                    return res.status(401).send({
                        success: false,
                        message: err
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            next();
        }
    };
};

module.exports = requiredToken;