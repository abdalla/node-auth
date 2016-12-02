import mongoose from 'mongoose';
import mockgoose from 'mockgoose';
import bluebird from 'bluebird';

/*
 * Creates and/or connects to a mongo test database in memory
 * @param {function} cb callback function
 * @returns {void}
 */
const createDB = (cb) => {
    mockgoose(mongoose).then(() => {
        mongoose.Promise = bluebird;
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