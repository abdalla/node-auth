module.exports = {
    'database': 'mongodb://localhost:27017/node-auth',
    'token' : {
        'publicKey': 'mysecretlife4u',
        'expires': {
            'oneDay': '1d',
            'oneMinute': 60
        }
    }
};