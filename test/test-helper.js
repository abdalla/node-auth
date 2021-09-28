'use strict';
import { MongoMemoryServer } from 'mongodb-memory-server';
import db from '../src/db';

let server;

/*
 * Creates and/or connects to a mongo test database in memory
 */
const createDB = async () => {
	if (!server) {
		server = await MongoMemoryServer.create();
	}

	const uri = server.getUri();
	
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
