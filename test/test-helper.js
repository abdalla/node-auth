'use strict';
import { Mockgoose } from 'mockgoose';
import db from '../src/db';

let mockgoose = new Mockgoose(db.mongoose);
/*
 * Creates and/or connects to a mongo test database in memory
 * @param {function} cb callback function
 * @returns {void}
 */
const createDB = async cb => {
	mockgoose.prepareStorage().then(() => {
		db.init();
		db.connect('memory', function(err) {
			done(err);
		});
		cb();
	});
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
