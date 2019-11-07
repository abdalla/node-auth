import mongoose from 'mongoose';

module.exports = {
	mongoose,
	connect: async database => {
		try {
			const conn =  await mongoose.connect(
				database,
				{ 
					useNewUrlParser: true,
					useUnifiedTopology: true 
				}
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
