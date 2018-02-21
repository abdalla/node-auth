import mongoose from 'mongoose';
import bluebird from 'bluebird';

module.exports = {
	mongoose,
	init: () => {
		mongoose.Promise = bluebird;
	},
	connect: async database => {
		try {
			const connection = await mongoose.connect(database, {
				useMongoClient: true
			});
			
			return connection;
		} catch (err) {
			//eslint-disable-next-line
			console.log('Error to connect on mongo', err);
		}
	},
	disconnect: async () => await mongoose.connection.close()
};
