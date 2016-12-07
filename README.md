[![PRs Welcome](https://img.shields.io/badge/prs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
# NODE Auth
It is an project to help to create an api using nodejs.
To avoid start from the very begin using authentication and mongodb as database.

# How to use
To use you will need to have a mongodb server and change it's config on `server.js` or `config.js` both in `src` folder.
![server.js](http://res.cloudinary.com/abdalla/image/upload/v1481067460/Screen_Shot_2016-12-06_at_6.30.54_PM_xllqfw.png)
![config.js](http://res.cloudinary.com/abdalla/image/upload/v1481067536/Screen_Shot_2016-12-06_at_6.38.39_PM_urqtq2.png)

# Running api
```
1 - git clone https://github.com/abdalla/node-auth.git
2 - npm install
3 - npm start
```

# Running tests
To run the tests you don't need to have mongodb installed, we are using mockgoose to simulale on.

Running tests to make sure everything is pretty simple...
```
npm t
```
or to get coverage statistic 
```
npm run test-cover
```

# Routes
### Setup
Used to create the first user (admin)

___Verbose:___ `GET`
```
http://localhost:3000/api/setup
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
```
{
	"email": "admin@node.com",
	"password": "admin"
}
```

Response:
```
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
```
x-access-token: "<token>"
```

Response:
```
{
  "success": true,
  "users": []
}
```

### Get user by id
NOT YET IMPLEMENTED

### Create new user
Used to create a new user.

___Verbose:___ `POST`
```
http://localhost:3000/api/user
```

Header:
```
Content-Type: application/json
x-access-token: "<token>"
```

Body: 
```
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
```
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
```
Content-Type: application/json
x-access-token: "<token>"
```

Body: 
```
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
```
{
  "success": true,
  "user": { user information }
}
```

### Update user password
NOT YET IMPLEMENTED


### Delete an user
Used to delete an user.

___Verbose:___ `DELETE`
```
http://localhost:3000/api/user/<userId>
```

Header:
```
x-access-token: "<token>"
```

Response:
```
{
  "success": true,
  "user": { user information }
}
```

## Core libraries
### For App
Express -  The most popular Node framework ( thinking to change to koa )

Mongoose - Interact with our MongoDB database

Morgan - Log requests to the console so we can see what is happening

body-parser - Get parameters from our POST requests

jsonwebtoken - Create and Verify our JSON Web Tokens

bluebird - Promise

### For Test
Mocha - The testing framework

Chai - Gives you some useful tools for testing, such as expect/should functions.

Mockgoose - Allows you to run Mongoose in-memory instead of connecting to a persistent database.

Factory-girl - For creating factories for your models.

Faker - For creating randomized data

Supertest - For performing requests in your tests

Istanbul - JS code coverage tool 