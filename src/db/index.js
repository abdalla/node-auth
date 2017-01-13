import mongoose from 'mongoose';
import bluebird from 'bluebird';

module.exports = {
    mongoose,
    init : () => {
        mongoose.Promise = bluebird;
    },
    connect : async (database) => {
        return await mongoose.connect(database);
    },
    disconnect : async () => {
        return await mongoose.connection.close();
    }
};