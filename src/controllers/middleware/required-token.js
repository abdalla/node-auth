//Rename it
//Make it as a npm package
"use strict"

const requiredToken =  ( options, tokenValidator ) => {
    return (req, res, next) => {

       if(!options.publicKey) throw 'publicKey is required';

        const ignoreRoute = ( options.ignoredRoutes || false ) && options.ignoredRoutes.some( route => route === req.originalUrl );
        
        if (!ignoreRoute) {
            // check header or url parameters or post parameters for token
            var token = req.body.token || req.query.token || req.headers['x-access-token'];
                    
            tokenValidator(token, function(err, decoded) {      
                if (err) {
                    return res.status(403).send({ 
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