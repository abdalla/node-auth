'use strict';
import MongodbMemoryServer from 'mongodb-memory-server';
import db from '../src/db';

const server = new MongodbMemoryServer();
/*
 * Creates and/or connects to a mongo test database in memory
 */
const createDB = async () => {
	const url = await server.getConnectionString();
	db.connect(url);
};

/*
 * Disconnects from and destroys the mongo test database in memory
 * @returns {void}
 */
const destroyDB = () => {
	db.disconnect();
	// server.stop();
};

module.exports = {
	createDB,
	destroyDB
};
