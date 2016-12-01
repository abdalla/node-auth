import factory from 'factory-girl';
import User from '../app/models/user';
import faker from 'faker';

//Now we’re ready to actually define our factories. You’ll see that we use faker to generate default data. 
factory.define('user', User, {
    name: () => faker.name.findName(),
    userName: () => faker.internet.userName(),
    password: () => faker.internet.password(),
    email: () => faker.internet.email(),
    admin: false
});

export default factory;