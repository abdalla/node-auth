'use strict';
import mockgoose from 'mockgoose';
import db from '../src/db';


/*
 * Creates and/or connects to a mongo test database in memory
 * @param {function} cb callback function
 * @returns {void}
 */
const createDB = (cb) => {
    mockgoose(db.mongoose).then(() => {
        db.init();
        db.connect('memory');
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