module.exports = {
    'database': 'mongodb://localhost:27017/node-auth',
    'token' : {
        'secret': 'mysecretlife4u',
        'expires': {
            'oneDay': '1d',
            'oneMinute': 60
        }
    }
};