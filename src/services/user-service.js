import jwt from 'jsonwebtoken';
import User from '../db/models/user';
import config from '../config';

const setupAdminUser = async () => {
    const user = new User({
        name: 'Admin',
        userName: 'admin',
        password: 'admin',
        email: 'admin@node.com',
        admin: true
    });

    try { 
        return await user.save();
    } catch (err) {
        throw err;
    }
};

const authentication = async (email, password) => {
    const filter = { email };
    try {
        const user = await User.findOne(filter);
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

const createNewUser = async user => {
    const saveUser = new User( user );
    try { 
        return await saveUser.save();
    } catch (err) {
        throw err;
    }
};

const updateUser = async (userId, user) => {
    const toSave = new User( user );
    try {
        const changedUser = await User.findByIdAndUpdate(userId, toSave, {new: true, runValidators: true});
        if (changedUser) {
            return changedUser;
        } else {
            throw 'User not found' ;
        }    
    } catch (err) {
        throw err;
    }
};

const updateUserPassword = async ({ userId, currentPassword, newPassword }) => {
    try {
        const user = await getUserById(userId);
        if (!user || !await user.validPassword(currentPassword)) {
            throw 'Current password invalid!';
        } else {
            user.password = newPassword;
            return await user.save(); 
        }
    } catch (err) {
        throw err;
    }
};

const deleteUser = async userId => {
    try {
        const user = await User.findByIdAndRemove(userId, { passRawResult:  true });
        if (user){
            return user;
        } else {
            throw 'User not found';
        }
    } catch (err) {
        throw err;
    }
};

const getUserById = async userId => {
    try {
        return User.findById(userId);
    } catch (err) {
        throw err;
    }
};

const getUserByFilter = async filter => {
    try {
        return await User.find(filter);
    } catch (err) {
        throw err;
    }
};

module.exports = {
    authentication,
    createNewUser,
    deleteUser,
    getUserByFilter,
    getUserById,
    setupAdminUser,
    updateUser,
    updateUserPassword
};
