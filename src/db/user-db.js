import User from './models/user';

const seed = async () => {
	const user = new User({
		name: 'Admin',
		userName: 'admin',
		password: 'admin',
		email: 'admin@node.com',
		admin: true
	});

	try { 
		return await save(user);
	} catch (err) {
		throw err;
	}
};

const getById = async userId => {
	try {
		return await User.findById(userId);
	} catch (err) {
		throw err;
	}
};

const getByEmail = async email => {
	try {
		return await User.findOne({ email });
	} catch (err) {
		throw err;
	}
};

const getByFilter = async (filter) => {
	try {
		return await User.find(filter);
	} catch (err) {
		throw err;
	}
};

const create = async user => {
	const newUser = new User( user );
	try { 
		return await save(newUser);
	} catch (err) {
		throw err;
	}
};

const update = async (userId, user) => {
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

const save = async user => {
	try {
		return await user.save();
	} catch (err) {
		throw err;
	}
};


module.exports = {
	seed,
	getById,
	getByEmail,
	getByFilter,
	create,
	update,
	'delete': deleteUser,
	save
};
