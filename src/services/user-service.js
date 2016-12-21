import jwt from 'jsonwebtoken';
import User from '../db/models/user';
import config from '../config'

const setupAdminUser = () => {
    const user = new User({
        name: 'Admin',
        userName: 'admin',
        password: 'admin',
        email: 'admin@node.com',
        admin: true
    });

   

    return user.save();
};

const authentication = (email, password) => {
    const filter = { email };

    return User.findOne(filter)
        .then(user => {
            if (!user || !user.validPassword(password)) {
                    throw( 'Authentication failed, email or password invalid.' );
            } else {
                const token = jwt.sign(user, config.token.publicKey, {
                    expiresIn: config.token.expires.oneDay
                });
                return token;
            }
        })
        .catch(err => {
            throw err;
        });
};

const createNewUser = user => {
    const saveUser = new User( user );
    return saveUser.save();
};

const updateUser = (userId, user) => {
    const toSave = new User( user );
    return User.findByIdAndUpdate(userId, toSave, {new: true, runValidators: true});
};

const updateUserPassword = ({ userId, currentPassword, newPassword }) => {
    return getUserById(userId)
        .then(user => {
            if (!user || !user.validPassword(currentPassword)) {
                throw( 'Current password invalid!' );
            } else {
                user.password = newPassword;
                return user.save();
            }
        })
        .then(user => user)
        .catch(err => {
            throw err;
        });
};

const deleteUser = userId => {
    return User.findByIdAndRemove(userId, { passRawResult:  true })
        .then(user => {
            if(user){
                return user;
            } else {
                throw 'User not found';
            }
        })
        .catch(err => { throw err; });
};

const getUserById = userId => {    
    return User.findById(userId);
};

const getUserByFilter = filter => {    
    return User.find(filter);
};

module.exports = {
    setupAdminUser,
    createNewUser,
    updateUser,
    updateUserPassword,
    deleteUser,
    getUserById,
    getUserByFilter,
    authentication
};