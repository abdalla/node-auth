'use strict';
import factory from 'factory-girl';
import User from '../src/db/models/user';
import faker from 'faker';

factory.define('user', User, {
	name: () => faker.name.findName(),
	userName: () => faker.internet.userName(),
	password: () => faker.internet.password(),
	email: () => faker.internet.email(),
	admin: false
});

export default factory;