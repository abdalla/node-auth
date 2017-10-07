module.exports = {
	database: 'mongodb://127.0.0.1:27017/node-auth',
	token: {
		publicKey: 'mysecretlife4u',
		expires: {
			oneDay: '1d',
			oneMinute: 60
		}
	}
};
