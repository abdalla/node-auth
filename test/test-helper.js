import mongoose from 'mongoose';
import mockgoose from 'mockgoose';

mockgoose(mongoose);

/*
 * Creates and/or connects to a mongo test database in memory
 * @param {function} cb callback function
 * @returns {void}
 */
module.exports.createDB = (cb) => {
    mongoose.connect('mongodb://localhost/auth-test', cb);
};

/*
 * Disconnects from and destroys the mongo test database in memory
 * @returns {void}
 */
module.exports.destroyDB = () => {
    mongoose.disconnect();
};