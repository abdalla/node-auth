import User from './models/user';

const seed = async () => {
	const user = new User({
		name: 'Admin',
		userName: 'admin',
		password: 'admin',
		email: 'admin@node.com',
		admin: true
	});

 
	return await save(user);
};

const getById = async userId => {
	return await User.findById(userId);
};

const getByEmail = async email => {
	return await User.findOne({ email });
};

const getByFilter = async (filter) => {
	return await User.find(filter);
};

const create = async user => {
	const newUser = new User( user );
	return await save(newUser);
};

const update = async (userId, user) => {
	const toSave = new User( user );
	const changedUser = await User.findByIdAndUpdate(userId, toSave, {new: true, runValidators: true});
	if (changedUser) {
		return changedUser;
	} else {
		throw 'User not found' ;
	}    
};

const deleteUser = async userId => {
	const user = await User.findByIdAndRemove(userId, { passRawResult:  true });
	if (user){
		return user;
	} else {
		throw 'User not found';
	}
};

const save = async user => {
	return await user.save();
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
