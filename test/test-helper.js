'use strict';
import MongodbMemoryServer from 'mongodb-memory-server';
import db from '../src/db';

const server = new MongodbMemoryServer();
/*
 * Creates and/or connects to a mongo test database in memory
 */
const createDB = async () => {
	const uri = await server.getUri();
	
	await db.connect(uri);
};

/*
 * Disconnects from and destroys the mongo test database in memory
 * @returns {void}
 */
const destroyDB = async () => {
	db.disconnect();
	await server.stop();
};

module.exports = {
	createDB,
	destroyDB
};
