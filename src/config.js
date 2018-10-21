//TODO: database should be into env file
module.exports = {
	database: 'mongodb://localhost:27017/node-auth', // If you are not running through docker you have to change here.
	token: {
		publicKey: 'mysecretlife4u',
		expires: {
			oneDay: '1d',
			oneMinute: 60
		}
	}
};
