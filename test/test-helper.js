'use strict';
import mongoose from 'mongoose';
import mockgoose from 'mockgoose';

/*
 * Creates and/or connects to a mongo test database in memory
 * @param {function} cb callback function
 * @returns {void}
 */
const createDB = (cb) => {
    mockgoose(mongoose).then(() => {
        mongoose.connect('memory', cb);
    });
};

/*
 * Disconnects from and destroys the mongo test database in memory
 * @returns {void}
 */
const destroyDB = () => {
    mongoose.disconnect();
};

module.exports = {
    createDB,
    destroyDB
}