import mongoose from 'mongoose';
import bluebird from 'bluebird';

module.exports = {
	mongoose,
	init: () => {
		mongoose.Promise = bluebird;
	},
	connect: async database => await mongoose.connect(database),
	disconnect: async () => await mongoose.connection.close()
};
