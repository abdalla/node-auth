[![Build Status](https://travis-ci.org/abdalla/node-auth.svg?branch=master)](https://travis-ci.org/abdalla/node-auth)
[![bitHound Code](https://www.bithound.io/github/abdalla/node-auth/badges/code.svg)](https://www.bithound.io/github/abdalla/node-auth)
[![bitHound Overall Score](https://www.bithound.io/github/abdalla/node-auth/badges/score.svg)](https://www.bithound.io/github/abdalla/node-auth)
[![Code Climate](https://codeclimate.com/github/abdalla/node-auth/badges/gpa.svg)](https://codeclimate.com/github/abdalla/node-auth)
[![Coverage Status](https://coveralls.io/repos/github/abdalla/node-auth/badge.svg?branch=master)](https://coveralls.io/github/abdalla/node-auth?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/abdalla/node-auth/badge.svg)](https://snyk.io/test/github/abdalla/node-auth)
[![PRs Welcome](https://img.shields.io/badge/prs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![NSP Status](https://nodesecurity.io/orgs/msdev/projects/6caad752-1ee9-49eb-a12c-b5a3c4a79f38/badge)](https://nodesecurity.io/orgs/msdev/projects/6caad752-1ee9-49eb-a12c-b5a3c4a79f38)
# NODE Auth
It is a project to help you to create an api using nodejs, with this kit, you will avoid starting from the very beginning using authentication and MongoDB as a database.

# How to use
To use it, you will need to have a mongodb server and change it's config on `config.js` into `src` folder.

___config.js___
```javascript
module.exports = {
    'database': 'mongodb://localhost:27017/node-auth'
}
```


# Running api
```zsh
1 - git clone https://github.com/abdalla/node-auth.git
2 - npm install
3 - npm start
```

# Running tests
To run the tests you don't need to have mongodb installed, we are using mockgoose to simulale on.

Running tests to make sure everything is working good.

It is pretty simple...
```zsh
npm test
```
or to get coverage statistics
```zsh
npm run test-cover
```

# Routes
### Setup
Used to create the first user (admin)

___Verbose:___ `POST`
```
http://localhost:3000/api/setup
```

Response:
```json
{
  "success": true,
  "user": { user information }
}
```

### Authentication
Used to authenticate the user and get the token used to comunicate with the other routes.

___Verbose:___ `POST`
```
http://localhost:3000/api/auth
```

Header:
```
Content-Type: application/json
```

Body:
```json
{
	"email": "admin@node.com",
	"password": "admin"
}
```

Response:
```json
{
  "success": true,
  "message": "enjoy",
  "token": "<token>"
}
```

### Get all users
Used to get all users.

___Verbose:___ `GET`
```
http://localhost:3000/api/users
```

Header:
```json
x-access-token: "<token>"
```

Response:
```json
{
  "success": true,
  "users": []
}
```

### Get user by id
Used to get a specific user.

___Verbose:___ `GET`
```
http://localhost:3000/api/user/{userId}
```

Header:
```json
x-access-token: "<token>"
```

Response:
```json
{
  "success": true,
  "user": { user information }
}
```

### Create new user
Used to create a new user.

___Verbose:___ `POST`
```
http://localhost:3000/api/user
```

Header:
```json
Content-Type: application/json
x-access-token: "<token>"
```

Body:
```json
{
  "user": {
    "name": "user full name",
    "userName": "user name",
    "password": "password",
    "email": "email@email.com",
    "admin": false
  }
}
```

Response:
```json
{
  "success": true,
  "user": { user information }
}
```

### Update an user
Used to update an user information (except password).

___Verbose:___ `PUT`
```
http://localhost:3000/api/user
```

Header:
```json
Content-Type: application/json
x-access-token: "<token>"
```

Body:
```json
{
  "user": {
    "_id": REQUIRED,
    "name": "user full name (optional)",
    "userName": "user name  (optional)",
    "email": "email@email.com  (optional)",
    "admin": false  (optional)
  }
}
```

Response:
```json
{
  "success": true,
  "user": { user information }
}
```

### Update user password
Used to change the user password.

___Verbose:___ `PUT`
```
http://localhost:3000/api/userpassword/{userId}
```

Header:
```json
Content-Type: application/json
x-access-token: "<token>"
```

Body:
```json
{
  currentPassword : 'currentPassword',
  newPassword: 'newPassword'
}
```

Response:
```json
{
  "success": true,
  "user": { user information
  }
}
```

### Delete an user
Used to delete an user.

___Verbose:___ `DELETE`
```
http://localhost:3000/api/user/<userId>
```

Header:
```json
x-access-token: "<token>"
```

Response:
```json
{
  "success": true,
  "user": { user information }
}
```

## Core libraries
### For App
[Express](https://expressjs.com) -  The most popular Node framework ( thinking to change to koa )

[Mongoose](http://mongoosejs.com) - Interact with our MongoDB database

[Morgan](https://github.com/expressjs/morgan) - Log requests to the console so we can see what is happening

[body-parser](https://github.com/expressjs/body-parser) - Get parameters from our POST requests

[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - Create and Verify our JSON Web Tokens

[bluebird](http://bluebirdjs.com/docs/getting-started.html) - Promise

### For Test
[Mocha](https://mochajs.org) - The testing framework

[Chai](http://chaijs.com) - Gives you some useful tools for testing, such as expect/should functions.

[Mockgoose](https://github.com/mockgoose/Mockgoose) - Allows you to run Mongoose in-memory instead of connecting to a persistent database.

[Factory-girl](https://github.com/thoughtbot/factory_girl) - For creating factories for your models.

[Faker](https://github.com/stympy/faker) - For creating randomized data

[Supertest](https://www.npmjs.com/package/supertest) - For performing requests in your tests

[Istanbul](https://www.npmjs.com/package/istanbul) - JS code coverage tool
