import mongoose from 'mongoose';
import mockgoose from 'mockgoose';
import config from '../config';

/*
 * Creates and/or connects to a mongo test database in memory
 * @param {function} cb callback function
 * @returns {void}
 */
module.exports.createDB = (cb) => {
    mockgoose(mongoose).then(() => {
        mongoose.connect(config.database, cb);
    });
    
};

/*
 * Disconnects from and destroys the mongo test database in memory
 * @returns {void}
 */
module.exports.destroyDB = () => {
    mongoose.disconnect();
};