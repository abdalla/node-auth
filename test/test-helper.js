'use strict';
import MongodbMemoryServer from 'mongodb-memory-server';
import { Mockgoose } from 'mockgoose';
import db from '../src/db';

let mockgoose = new Mockgoose(db.mongoose);
/*
 * Creates and/or connects to a mongo test database in memory
 */
const createDB = async () => {
	try {
		await mockgoose.prepareStorage();
	} catch (err) {
		throw err;
	}
};

/*
 * Disconnects from and destroys the mongo test database in memory
 * @returns {void}
 */
const destroyDB = () => db.disconnect();

module.exports = {
	createDB,
	destroyDB
};
