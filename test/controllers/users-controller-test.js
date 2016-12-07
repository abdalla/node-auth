'use strict';
import chai, { expect } from 'chai';
import request from 'supertest';
import factory from '../factory';
import server from '../../src/server';
import { createDB, destroyDB } from '../test-helper';

describe('Users', () => {
    before((done) => {
        chai.config.includeStack = true;
        createDB(() => {
            done();
        });
    });

    let _user = {};
    let _token = '';

    describe('Setup', () => {
        it('should setup a user for test', (done) => {
            request(server)
                .post('/api/setup')
                .expect(200)
                .then((res) => {
                    _user = res.body.user;
                    expect(res.body.success).to.be.equal(true);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('Authentication', () => {
        it('should authenticate using the user created on setup', (done) => {
            request(server)
                .post('/api/auth')
                .send({ email: 'admin@node.com', password: 'admin' })
                .expect(200)
                .then((res) => {
                    _token = res.body.token;
                    expect(res.body.success).to.be.equal(true);
                    expect(res.body.token).to.be.an('string');
                    done();
                })
                .catch((err) => done(err));
        });

        it('should NOT authenticate using the user created on setup', (done) => {
            request(server)
                .post('/api/auth')
                .send({ email: 'admin@node.com', password: 'admin123456' })
                .expect(200)
                .then((res) => {
                    expect(res.body.success).to.be.equal(false);
                    chai.should().not.exist(res.body.token);
                    done();
                })
                .catch((err) => done(err));
        });

    });

    describe('Read', function () {
       it('should get all users when given the correct credentials', (done) => {
            request(server)
                .get('/api/users')
                .set('x-access-token', _token)
                .expect(200)
                .then((res) => {
                    expect(res.body.success).to.be.equal(true);
                    expect(res.body.users).to.be.an('array');
                    done();
                })
                .catch((err) => done(err));
       });

       it('should NOT get all users passing id and given the correct credentials', (done) => {
            request(server)
                .get('/api/users/5')
                .set('x-access-token', _token)
                .expect(404)
                .then((res) => {
                    done();
                })
                .catch((err) => done(err));
       });

       it('should NOT get all users passing invalid credentials', (done) => {
            request(server)
                .get('/api/users')
                .set('x-access-token', _token + '1234')
                .expect(401)
                .then((res) => {
                    expect(res.body.success).to.be.equal(false);
                    expect(res.body.message).to.be.equal('Failed to authenticate token');
                    done();
                })
                .catch((err) => done(err));
       });

       it('should NOT get all users with no credentials', (done) => {
            request(server)
                .get('/api/users')
                .expect(403)
                .then((res) => {
                    expect(res.body.success).to.be.equal(false);
                    expect(res.body.message).to.be.equal('Token is required.');
                    done();
                })
                .catch((err) => done(err));
       });

       it('should get user when given the correct credentials', (done) => {
            request(server)
                .get(`/api/user/${_user._id}`)
                .set('x-access-token', _token)
                .expect(200)
                .then((res) => {
                    expect(res.body.success).to.be.equal(true);
                    expect(res.body.user).to.be.an('object');
                    expect(res.body.user._id).to.be.equal(_user._id);
                    done();
                })
                .catch((err) => done(err));
       });

       it('should NOT get user without id', (done) => {
            request(server)
                .get(`/api/user/`)
                .set('x-access-token', _token)
                .expect(404)
                .then((res) => {
                    done();
                })
                .catch((err) => done(err));
       });

       it('should get user with incorrect id', (done) => {
            request(server)
                .get(`/api/user/123456`)
                .set('x-access-token', _token)
                .expect(500)
                .then((res) => {
                    expect(res.body.success).to.be.equal(false);
                    done();
                })
                .catch((err) => done(err));
       });

       it('should get user with incorrect token', (done) => {
            request(server)
                .get(`/api/user/${_user._id}`)
                .set('x-access-token', '123456')
                .expect(401)
                .then((res) => {
                    expect(res.body.success).to.be.equal(false);
                    done();
                })
                .catch((err) => done(err));
       });

       it('should get user without token', (done) => {
            request(server)
                .get(`/api/user/${_user._id}`)
                .expect(403)
                .then((res) => {
                    expect(res.body.success).to.be.equal(false);
                    done();
                })
                .catch((err) => done(err));
       });



    });

    describe('Create', () =>{
        it('should register a user when given the correct credentials', (done) => {
            let user = factory.build('user')
                .then(user => {
                    request(server)
                        .post('/api/user')
                        .send({ user : user })
                        .set('x-access-token', _token)
                        .expect(200)
                        .then((res) => {
                            expect(res.body.success).to.be.equal(true);
                            expect(res.body.user).to.be.an('object');
                            done();
                        })
                        .catch((err) => done(err));
                });
        });

        it('should NOT register a user whith NO credentials', (done) => {
            let user = factory.build('user')
                .then(user => {
                    request(server)
                        .post('/api/user')
                        .send({ user : user })
                        .expect(403)
                        .then((res) => {
                            expect(res.body.success).to.be.equal(false);
                            expect(res.body.message).to.be.equal('Token is required.');
                            done();
                        })
                        .catch((err) => done(err));
                });
        });

        it('should NOT register a user whith invalid credentials', (done) => {
            let user = factory.build('user')
                .then(user => {
                    request(server)
                        .post('/api/user')
                        .send({ user : user })
                        .set('x-access-token', _token + '123456')
                        .expect(401)
                        .then((res) => {
                            expect(res.body.success).to.be.equal(false);
                            expect(res.body.message).to.be.equal('Failed to authenticate token');
                            done();
                        })
                        .catch((err) => done(err));
                });
        });

        let existingUser = {};
        it('should NOT register a user when given the correct credentials and did not send name (required field)', (done) => {
            let user = factory.build('user')
                .then(user => {
                    existingUser = user;
                    user.name = '';
                    request(server)
                        .post('/api/user')
                        .send({ user : user })
                        .set('x-access-token', _token)
                        .expect(500)
                        .then((res) => {
                            expect(res.body.success).not.to.be.equal(true);
                            done();
                        })
                        .catch((err) => done(err));
                });
        });

        it('should NOT register a user with existend userName', (done) => {
            let user = factory.build('user')
                .then(user => {
                    existingUser.email = 'other@email.com';
                    request(server)
                        .post('/api/user')
                        .send({ user : existingUser })
                        .set('x-access-token', _token)
                        .expect(500)
                        .then((res) => {
                            expect(res.body.success).not.to.be.equal(true);
                            done();
                        })
                        .catch((err) => done(err));
                });
        });

        it('should NOT register a user with existend email', (done) => {
            let user = factory.build('user')
                .then(user => {
                    existingUser.userName = 'otherUserName';
                    request(server)
                        .post('/api/user')
                        .send({ user : existingUser })
                        .set('x-access-token', _token)
                        .expect(500)
                        .then((res) => {
                            expect(res.body.success).not.to.be.equal(true);
                            done();
                        })
                        .catch((err) => done(err));
                });
        });

        it('should NOT register a user when given the correct credentials and did not send email (required field)', (done) => {
            let user = factory.build('user')
                .then(user => {
                    user.email = '';
                    request(server)
                        .post('/api/user')
                        .send({ user : user })
                        .set('x-access-token', _token)
                        .expect(500)
                        .then((res) => {
                            expect(res.body.success).not.to.be.equal(true);
                            done();
                        })
                        .catch((err) => done(err));
                });
        });

        it('should NOT register a user when given the correct credentials and did not send userName (required field)', (done) => {
            let user = factory.build('user')
                .then(user => {
                    user.userName = '';
                    request(server)
                        .post('/api/user')
                        .send({ user : user })
                        .set('x-access-token', _token)
                        .expect(500)
                        .then((res) => {
                            expect(res.body.success).not.to.be.equal(true);
                            done();
                        })
                        .catch((err) => done(err));
                });
        });

        it('should NOT register a user when given the correct credentials and did not send password (required field)', (done) => {
            let user = factory.build('user')
                .then(user => {
                    user.password = '';
                    request(server)
                        .post('/api/user')
                        .send({ user : user })
                        .set('x-access-token', _token)
                        .expect(500)
                        .then((res) => {
                            expect(res.body.success).not.to.be.equal(true);
                            done();
                        })
                        .catch((err) => done(err));
                });
        });
    });

    describe('Update', () => {

        it('should update a user when given the correct credentials', (done) => {
            let _userUpdate = {
                _id: _user._id,
                name: 'John Due',
                userName: 'jd',
                email: 'jd@a.com',
                admin: false
            };

            request(server)
                .put('/api/user')
                .send({ user : _userUpdate })
                .set('x-access-token', _token)
                .expect(200)
                .then((res) => {
                    expect(res.body.success).to.be.equal(true);
                    expect(res.body.user).to.be.an('object');
                    done();
                })
                .catch((err) => done(err));

        });

        it('should NOT update a user with NO credentials', (done) => {
            let _userUpdate = {
                _id: _user._id,
                name: 'John Due',
                userName: 'jd',
                email: 'jd@a.com',
                admin: false
            };

            request(server)
                .put('/api/user')
                .send({ user : _userUpdate })
                .expect(403)
                .then((res) => {
                    expect(res.body.success).to.be.equal(false);
                    expect(res.body.message).to.be.equal('Token is required.');
                    done();
                })
                .catch((err) => done(err));

        });

        it('should NOT update a user with invalid credentials', (done) => {
            let _userUpdate = {
                _id: _user._id,
                name: 'John Due',
                userName: 'jd',
                email: 'jd@a.com',
                admin: false
            };

            request(server)
                .put('/api/user')
                .send({ user : _userUpdate })
                .set('x-access-token', _token + '5555555')
                .expect(401)
                .then((res) => {
                    expect(res.body.success).to.be.equal(false);
                    expect(res.body.message).to.be.equal('Failed to authenticate token');
                    done();
                })
                .catch((err) => done(err));

        });

        it('should NOT update a user without ID', (done) => {
            let _userUpdate = {
                name: 'John Due',
                userName: 'jd',
                email: 'jd@a.com',
                admin: false
            };

            request(server)
                .put('/api/user')
                .send({ user : _userUpdate })
                .set('x-access-token', _token)
                .expect(500)
                .then((res) => {
                    expect(res.body.success).to.be.equal(false);
                    done();
                })
                .catch((err) => done(err));

        });

        it('should NOT update a user with invalid ID', (done) => {
            let _userUpdate = {
                _id: 5552554848848,
                name: 'John Due',
                userName: 'jd',
                email: 'jd@a.com',
                admin: false
            };

            request(server)
                .put('/api/user')
                .send({ user : _userUpdate })
                .set('x-access-token', _token)
                .expect(500)
                .then((res) => {
                    expect(res.body.success).to.be.equal(false);
                    done();
                })
                .catch((err) => done(err));
        });
    });

    describe('Delete', () => {
        it('should delete a user when given the correct credentials', (done) => {
            request(server)
                .delete(`/api/user/${_user._id}`)
                .set('x-access-token', _token)
                .expect(200)
                .then((res) => {
                    expect(res.body.success).to.be.equal(true);
                    chai.should().exist(res.body.user);
                    done();
                })
                .catch((err) => done(err));
        });

        it('should NOT delete a user that was already deleted when given the correct credentials', (done) => {
            request(server)
                .delete(`/api/user/${_user._id}`)
                .set('x-access-token', _token)
                .expect(500)
                .then((res) => {
                    expect(res.body.success).to.be.equal(false);
                    chai.should().not.exist(res.body.user);
                    done();
                })
                .catch((err) => done(err));
        });

        it('should NOT delete a user passing invalid credentials', (done) => {
            request(server)
                .delete(`/api/user/${_user._id}`)
                .set('x-access-token', _token + '12345678')
                .expect(401)
                .then((res) => {
                    expect(res.body.success).to.be.equal(false);
                    chai.should().not.exist(res.body.user);
                    done();
                })
                .catch((err) => done(err));
        });

        it('should NOT delete a user passing NO credentials', (done) => {
            request(server)
                .delete(`/api/user/${_user._id}`)
                .expect(403)
                .then((res) => {
                    expect(res.body.success).to.be.equal(false);
                    chai.should().not.exist(res.body.user);
                    done();
                })
                .catch((err) => done(err));
        });

        it('should NOT delete a user Without ID', (done) => {
            request(server)
                .delete(`/api/user`)
                .set('x-access-token', _token)
                .expect(404)
                .then((res) => {
                   done();
                })
                .catch((err) => done(err));
        });
    });

    after(() => {
        destroyDB();
    });
});

