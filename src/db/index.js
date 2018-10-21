import mongoose from 'mongoose';
import bluebird from 'bluebird';

module.exports = {
	mongoose,
	init: () => {
		mongoose.Promise = bluebird;
	},
	connect: async database => {
		try {
			const conn =  await mongoose.connect(
				database,
				{ useNewUrlParser: true }
			);

			//eslint-disable-next-line
			console.log(`MongoDb Connected on: ${database}`);
			
			return conn;
		} catch (err) {
			//eslint-disable-next-line
			console.log('Error to connect on mongo', err);
		}
	},
	disconnect: async () => await mongoose.connection.close()
};
