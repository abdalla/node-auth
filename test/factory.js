//First we need to handle all of our imports.
import factoryGirl from 'factory-girl';
import User from '../app/models/user';
import faker from 'faker';
import bluebird from 'bluebird';

//Next, we want to promisify factory-girl which will make testing much easier later on.
//let factory = factoryGirl.factory.promisify(bluebird);

//let factory = factoryGirl;
let factory = require('factory-girl').factory;

//Now we’re ready to actually define our factories. You’ll see that we use faker to generate default data. 
factory.define('user', User, {
    local: {
        email: () => faker.internet.email(),
        password: () => faker.internet.password(),
        name: () => faker.name.findName()
    }
});

export default factory;