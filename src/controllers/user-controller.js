import userService from '../services/user-service';

const routes = (app, router) => {
	'use strict';

	router.get('/', (req, res) => {
		res.send('The API is at http://url/api');
	});

	router.post('/setup', async (req, res) => {
		try {
			const adminUser = await userService.setupAdminUser();
			return res.json({
				success: true,
				user: adminUser
			});
		} catch (err) {
			res.status(500).json({
				success: false,
				err
			});
		}
	});

	router.post('/auth', async (req, res) => {
		try {
			const token = await userService.authentication(req.body.email, req.body.password);
			return res.json({
				success: true,
				token
			});
		} catch (err) {
			return res.status(500).json({
				success: false,
				err
			});
		}
	});

	router.get('/users', async (req, res) => {
		try {
			const users = await userService.getUserByFilter({});
			return res.status(200).json({
				success: true,
				users
			});
		} catch (err) {
			res.status(500).json({
				success: false,
				err
			});
		}
	});

	router.get('/user/:id', async (req, res) => {
		try {
			const user = await userService.getUserById(req.params.id);
			return res.json({
				success: true,
				user
			});
		} catch (err) {
			res.status(500).json({
				success: false,
				err
			});
		}
	});

	router.post('/user', async (req, res) => {
		try {
			const createdUser = await userService.createNewUser(req.body.user);
			return res.json({
				success: true,
				user: createdUser
			});
		} catch (err) {
			res.status(500).json({
				success: false,
				err
			});
		}
	});

	router.put('/user', async (req, res) => {
		try {
			const updatedUser = await userService.updateUser(req.body.user._id, req.body.user);
			return res.json({
				success: true,
				user: updatedUser
			});
		} catch (err) {
			res.status(500).json({
				success: false,
				err
			});
		}
	});

	router.put('/userpassword/:id', async (req, res) => {
		try {
			const newUserPassword = {
				userId: req.params.id,
				currentPassword: req.body.currentPassword,
				newPassword: req.body.newPassword
			};

			const updatedPasswordUser = await userService.updateUserPassword(newUserPassword);
			return res.json({
				success: true,
				user: updatedPasswordUser
			});

		} catch (err) {
			return res.status(500).json({
				success: false,
				err
			});
		}
	});

	router.delete('/user/:id', async (req, res) => {
		try {
			const deletedUser = await userService.deleteUser(req.params.id);
			return res.json({
				success: true,
				user: deletedUser
			});
		} catch (err) {
			return res.status(500).json({
				success: false,
				err
			});
		}
	});
};

module.exports = routes;
