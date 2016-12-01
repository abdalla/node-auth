module.exports = {
    'database': 'mongodb://localhost:27017/node-auth',
    'token' : {
        'secret': 'mysecretlife4u',
        'expires': {
            'oneDa': '1d',
            'oneMinut': 60
        }
    }
};