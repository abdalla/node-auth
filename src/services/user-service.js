import jwt from 'jsonwebtoken';
import userDb from '../db/user-db.js';
import config from '../config';

const setupAdminUser = async () => {
    try { 
        return await userDb.seed();
    } catch (err) {
        throw err;
    }
};

const authentication = async (email, password) => {
    try {
        const user = await userDb.getByEmail(email);
        if (!user || !await user.validPassword(password)) {
            throw 'Authentication failed, email or password invalid.';
        } else {
            const token = await jwt.sign(user, config.token.publicKey, {
                expiresIn: config.token.expires.oneDay
            });
            return token;
        }
    } catch (err) {
        throw err;
    }
};

const getUserById = async userId => {
    try {
        return await userDb.getById(userId);
    } catch (err) {
        throw err;
    }
};

const getUserByFilter = async filter => {
    try {
        return await userDb.getByFilter(filter);
    } catch (err) {
        throw err;
    }
};

const createNewUser = async user => {
    try { 
        return await userDb.create(user);
    } catch (err) {
        throw err;
    }
};

const updateUser = async (userId, user) => {
    try {
        return await userDb.update(userId, user);
    } catch (err) {
        throw err;
    }
};

const updateUserPassword = async ({ userId, currentPassword, newPassword }) => {
    try {
        const user = await userDb.getById(userId);
        if (!user || !await user.validPassword(currentPassword)) {
            throw 'Current password invalid!';
        } else {
            user.password = newPassword;
            return await userDb.save(user); 
        }
    } catch (err) {
        throw err;
    }
};

const deleteUser = async userId => {
    try {
        return await userDb.delete(userId);
    } catch (err) {
        throw err;
    }
};

module.exports = {
    setupAdminUser,
    authentication,
    getUserById,
    getUserByFilter,
    createNewUser,
    deleteUser,
    updateUser,
    updateUserPassword
};
