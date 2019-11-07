'use strict';
import chai, { expect } from 'chai';
import request from 'supertest';
import factory from '../factory';
import { server, stopServer } from '../../src/server';
import { createDB, destroyDB } from '../test-helper';

describe('Users', () => {
	before(() => {
		chai.config.includeStack = true;
		createDB();
	});

	let _user = {};
	let _token = '';

	describe('Setup', () => {
		it('should setup a user for test', async () => {
			
			const res = await request(server)
				.post('/api/setup')
				.expect(200);
			_user = res.body.user;
			await expect(res.body.success).to.be.equal(true);
			
		});
	});

	describe('Authentication', () => {
		it('should authenticate using the user created on setup', async () => {
			
			const res = await request(server)
				.post('/api/auth')
				.send({ email: 'admin@node.com', password: 'admin' })
				.expect(200);
			_token = res.body.token;
			await expect(res.body.success).to.be.equal(true);
			await expect(res.body.token).to.be.an('string');
			
		});

		it('should NOT authenticate using the user created on setup', async () => {
			
			const res = await request(server)
				.post('/api/auth')
				.send({ email: 'admin@node.com', password: 'admin123456' })
				.expect(500);
			await expect(res.body.success).to.be.equal(false);
			await chai.should().not.exist(res.body.token);
			
		});
	});

	describe('Read', () => {
		it('should get all users when given the correct credentials', async () => {
			
			const res = await request(server)
				.get('/api/users')
				.set('x-access-token', _token)
				.expect(200);
			await expect(res.body.success).to.be.equal(true);
			await expect(res.body.users).to.be.an('array');
			
		});

		it('should NOT get all users passing id and given the correct credentials', async () => {
			
			await request(server)
				.get('/api/users/5')
				.set('x-access-token', _token)
				.expect(404);
			
		});

		it('should NOT get all users passing invalid credentials', async () => {
			
			const res = await request(server)
				.get('/api/users')
				.set('x-access-token', _token + '1234')
				.expect(401);
			await expect(res.body.success).to.be.equal(false);
			await expect(res.body.message).to.be.equal(
				'Failed to authenticate token'
			);
			
		});

		it('should NOT get all users with no credentials', async () => {
			
			const res = await request(server)
				.get('/api/users')
				.expect(403);
			await expect(res.body.success).to.be.equal(false);
			await expect(res.body.message).to.be.equal('Token is required.');
			
		});

		it('should get user when given the correct credentials', async () => {
			
			const res = await request(server)
				.get(`/api/user/${_user._id}`)
				.set('x-access-token', _token)
				.expect(200);
			await expect(res.body.success).to.be.equal(true);
			await expect(res.body.user).to.be.an('object');
			await expect(res.body.user._id).to.be.equal(_user._id);
			
		});

		it('should NOT get user without id', async () => {
			
			await request(server)
				.get('/api/user/')
				.set('x-access-token', _token)
				.expect(404);
			
		});

		it('should get user with incorrect id', async () => {
			
			const res = await request(server)
				.get('/api/user/123456')
				.set('x-access-token', _token)
				.expect(500);
			await expect(res.body.success).to.be.equal(false);
			
		});

		it('should get user with incorrect token', async () => {
			
			const res = await request(server)
				.get(`/api/user/${_user._id}`)
				.set('x-access-token', '123456')
				.expect(401);
			await expect(res.body.success).to.be.equal(false);
			
		});

		it('should get user without token', async () => {
			
			const res = await request(server)
				.get(`/api/user/${_user._id}`)
				.expect(403);
			await expect(res.body.success).to.be.equal(false);
			
		});
	});

	describe('Create', () => {
		it('should register a user when given the correct credentials', async () => {
			
			const user = await factory.build('user');
			const res = await request(server)
				.post('/api/user')
				.send({ user: user })
				.set('x-access-token', _token)
				.expect(200);
			await expect(res.body.success).to.be.equal(true);
			await expect(res.body.user).to.be.an('object');
			
		});

		it('should NOT register a user whith NO credentials', async () => {
			
			const user = await factory.build('user');
			const res = await request(server)
				.post('/api/user')
				.send({ user: user })
				.expect(403);
			await expect(res.body.success).to.be.equal(false);
			await expect(res.body.message).to.be.equal('Token is required.');
			
		});

		it('should NOT register a user whith invalid credentials', async () => {
			
			const user = await factory.build('user');
			const res = await request(server)
				.post('/api/user')
				.send({ user: user })
				.set('x-access-token', _token + '123456')
				.expect(401);

			await expect(res.body.success).to.be.equal(false);
			await expect(res.body.message).to.be.equal(
				'Failed to authenticate token'
			);
			
		});

		let existingUser = {};
		it('should NOT register a user when given the correct credentials and did not send name (required field)', async () => {
			
			let user = await factory.build('user');
			existingUser = user;
			user.name = '';
			const res = await request(server)
				.post('/api/user')
				.send({ user: user })
				.set('x-access-token', _token)
				.expect(500);

			await expect(res.body.success).not.to.be.equal(true);
			
		});

		it('should NOT register a user with existend userName', async () => {
			
			existingUser.email = 'other@email.com';
			const res = await request(server)
				.post('/api/user')
				.send({ user: existingUser })
				.set('x-access-token', _token)
				.expect(500);
			await expect(res.body.success).not.to.be.equal(true);
			
		});

		it('should NOT register a user with existend email', async () => {
			
			existingUser.userName = 'otherUserName';
			const res = await request(server)
				.post('/api/user')
				.send({ user: existingUser })
				.set('x-access-token', _token)
				.expect(500);

			await expect(res.body.success).not.to.be.equal(true);
			
		});

		it('should NOT register a user when given the correct credentials and did not send email (required field)', async () => {
			
			let user = await factory.build('user');
			user.email = '';
			const res = await request(server)
				.post('/api/user')
				.send({ user: user })
				.set('x-access-token', _token)
				.expect(500);
			await expect(res.body.success).not.to.be.equal(true);
			
		});

		it('should NOT register a user when given the correct credentials and did not send userName (required field)', async () => {
			
			let user = await factory.build('user');
			user.userName = '';
			const res = await request(server)
				.post('/api/user')
				.send({ user: user })
				.set('x-access-token', _token)
				.expect(500);
			await expect(res.body.success).not.to.be.equal(true);
			
		});

		it('should NOT register a user when given the correct credentials and did not send password (required field)', async () => {
			
			let user = await factory.build('user');
			user.password = '';
			const res = await request(server)
				.post('/api/user')
				.send({ user: user })
				.set('x-access-token', _token)
				.expect(500);
			await expect(res.body.success).not.to.be.equal(true);
			
		});
	});

	describe('Update', () => {
		it('should update a user when given the correct credentials', async () => {
			
			const _userUpdate = {
				_id: _user._id,
				name: 'John Due',
				userName: 'jd',
				email: 'jd@a.com',
				admin: false
			};

			const res = await request(server)
				.put('/api/user')
				.send({ user: _userUpdate })
				.set('x-access-token', _token)
				.expect(200);
			await expect(res.body.success).to.be.equal(true);
			await expect(res.body.user).to.be.an('object');
			
		});

		it('should NOT update a user with NO credentials', async () => {
			
			const _userUpdate = {
				_id: _user._id,
				name: 'John Due',
				userName: 'jd',
				email: 'jd@a.com',
				admin: false
			};

			const res = await request(server)
				.put('/api/user')
				.send({ user: _userUpdate })
				.expect(403);
			await expect(res.body.success).to.be.equal(false);
			await expect(res.body.message).to.be.equal('Token is required.');
			
		});

		it('should NOT update a user with invalid credentials', async () => {
			let _userUpdate = {
				_id: _user._id,
				name: 'John Due',
				userName: 'jd',
				email: 'jd@a.com',
				admin: false
			};

			
			const res = await request(server)
				.put('/api/user')
				.send({ user: _userUpdate })
				.set('x-access-token', _token + '5555555')
				.expect(401);
			await expect(res.body.success).to.be.equal(false);
			await expect(res.body.message).to.be.equal(
				'Failed to authenticate token'
			);
			
		});

		it('should NOT update a user without ID', async () => {
			
			const _userUpdate = {
				name: 'John Due',
				userName: 'jd',
				email: 'jd@a.com',
				admin: false
			};
			const res = await request(server)
				.put('/api/user')
				.send({ user: _userUpdate })
				.set('x-access-token', _token)
				.expect(500);

			await expect(res.body.success).to.be.equal(false);
			
		});

		it('should NOT update a user with invalid ID', async () => {
			
			const _userUpdate = {
				_id: 5552554848848,
				name: 'John Due',
				userName: 'jd',
				email: 'jd@a.com',
				admin: false
			};

			const res = await request(server)
				.put('/api/user')
				.send({ user: _userUpdate })
				.set('x-access-token', _token)
				.expect(500);
			await expect(res.body.success).to.be.equal(false);
			
		});
	});

	describe('Delete', () => {
		it('should delete a user when given the correct credentials', async () => {
			
			const res = await request(server)
				.delete(`/api/user/${_user._id}`)
				.set('x-access-token', _token)
				.expect(200);

			await expect(res.body.success).to.be.equal(true);
			await chai.should().exist(res.body.user);
			
		});

		it('should NOT delete a user that was already deleted when given the correct credentials', async () => {
			
			const res = await request(server)
				.delete(`/api/user/${_user._id}`)
				.set('x-access-token', _token)
				.expect(500);
			await expect(res.body.success).to.be.equal(false);
			await chai.should().not.exist(res.body.user);
			
		});

		it('should NOT delete a user passing invalid credentials', async () => {
			
			const res = await request(server)
				.delete(`/api/user/${_user._id}`)
				.set('x-access-token', _token + '12345678')
				.expect(401);

			await expect(res.body.success).to.be.equal(false);
			await chai.should().not.exist(res.body.user);
			
		});

		it('should NOT delete a user passing NO credentials', async () => {
			
			const res = await request(server)
				.delete(`/api/user/${_user._id}`)
				.expect(403);
			await expect(res.body.success).to.be.equal(false);
			await chai.should().not.exist(res.body.user);
			
		});

		it('should NOT delete a user Without ID', async () => {
			
			await request(server)
				.delete('/api/user')
				.set('x-access-token', _token)
				.expect(404);
			
		});
	});

	describe('Update user password', () => {
		it('should update a user password when given the correct credentials', async () => {
			
			let user = await factory.build('user');
			user.password = '123456';
			let res = await request(server)
				.post('/api/user')
				.send({ user: user })
				.set('x-access-token', _token)
				.expect(200);
			res.body.user.password = '123456';
			await request(server)
				.put(`/api/userpassword/${res.body.user._id}`)
				.send({
					currentPassword: res.body.user.password,
					newPassword: 'new_password'
				})
				.set('x-access-token', _token)
				.expect(200);
			await expect(res.body.success).to.be.equal(true);
			await expect(res.body.user).to.be.an('object');
			
		});

		it('should NOT update a user password with wrong current password', async () => {
			
			const user = await factory.build('user');
			const res = await request(server)
				.post('/api/user')
				.send({ user: user })
				.set('x-access-token', _token)
				.expect(200);

			const res2 = await request(server)
				.put(`/api/userpassword/${res.body.user._id}`)
				.send({
					currentPassword: 'wrong pwd',
					newPassword: 'new_password'
				})
				.set('x-access-token', _token)
				.expect(500);

			await expect(res2.body.success).to.be.equal(false);
			await expect(res2.body.err).to.be.equal('Current password invalid!');
			
		});

		it('should NOT update a user password without new password', async () => {
			
			let user = await factory.build('user');
			user.password = '123456';
			const res = await request(server)
				.post('/api/user')
				.send({ user: user })
				.set('x-access-token', _token)
				.expect(200);
			res.body.user.password = '123456';
			const res2 = await request(server)
				.put(`/api/userpassword/${res.body.user._id}`)
				.send({
					currentPassword: res.body.user.password
				})
				.set('x-access-token', _token)
				.expect(500);
			await expect(res2.body.success).to.be.equal(false);
			
		});

		it('should NOT update a user password with invalid UserId', async () => {
			
			const res = await request(server)
				.put('/api/userpassword/1234565')
				.send({
					currentPassword: _user.password,
					newPassword: 'new_password'
				})
				.set('x-access-token', _token)
				.expect(500);

			await expect(res.body.success).to.be.equal(false);
			
		});

		it('should NOT update a user password when given invalid credencials', async () => {
			
			const res = await request(server)
				.put(`/api/userpassword/${_user._id}`)
				.send({
					currentPassword: 'wrong pwd',
					newPassword: 'new_password'
				})
				.set('x-access-token', '123456')
				.expect(401);
			await expect(res.body.success).to.be.equal(false);
			
		});

		it('should NOT update a user password with no credencials', async () => {
			
			const res = await request(server)
				.put(`/api/userpassword/${_user._id}`)
				.send({
					currentPassword: 'wrong pwd',
					newPassword: 'new_password'
				})
				.expect(403);
			await expect(res.body.success).to.be.equal(false);
			
		});
		after(() => {
			stopServer();
			destroyDB();
		});
	});
});
