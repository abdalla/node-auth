import jwt from 'jsonwebtoken';
import userDb from '../db/user-db.js';
import config from '../config';

const setupAdminUser = async () => {
	return await userDb.seed();
};

const authentication = async (email, password) => {
	const user = await userDb.getByEmail(email);
		
	if (!user || !await user.validPassword(password)) {
		throw 'Authentication failed, email or password invalid.';
	} else {
		const token = await jwt.sign(user.toObject(), config.token.publicKey, {
			expiresIn: config.token.expires.oneDay
		});
		return token;
	}
};

const getUserById = async userId => {
	return await userDb.getById(userId);
};

const getUserByFilter = async filter => {
	return await userDb.getByFilter(filter);
};

const createNewUser = async user => {
	return await userDb.create(user);
};

const updateUser = async (userId, user) => {
	return await userDb.update(userId, user);
};

const updateUserPassword = async ({ userId, currentPassword, newPassword }) => {
	const user = await userDb.getById(userId);
	if (!user || !await user.validPassword(currentPassword)) {
		throw 'Current password invalid!';
	} else {
		user.password = newPassword;
		return await userDb.save(user); 
	}
};

const deleteUser = async userId => {
	return await userDb.delete(userId);
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
