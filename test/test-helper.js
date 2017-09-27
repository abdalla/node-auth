'use strict';
import { Mockgoose } from 'mockgoose';
import db from '../src/db';

let mockgoose = new Mockgoose(db.mongoose);
/*
 * Creates and/or connects to a mongo test database in memory
 */
const createDB = async () => {
	await mockgoose.prepareStorage();
	db.init();
	db.connect('memory', { useMongoClient: true });
};

/*
 * Disconnects from and destroys the mongo test database in memory
 * @returns {void}
 */
const destroyDB = () => {
	db.disconnect();
};

module.exports = {
	createDB,
	destroyDB
};
