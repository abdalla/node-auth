import { expect } from 'chai';
import request from 'supertest';
import factory from '../factory';
import server from '../../src/server';
import { createDB, destroyDB } from '../test-helper';

describe('Users', () => {
    before((done) => {
        createDB(() => {
            done();
        });
    });

    let _user = {};
    it('should setup a user for test', (done) => {
        request(server)
            .get('/api/setup')
            .expect(200)
            .then((res) => {
                _user = res.body.user;
                expect(res.body.success).to.be.equal(true);
                done();
            })
            .catch((err) => done(err));
    });

    let _token = '';
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

    it('should NOT register a user when given the correct credentials and did not send name (required field)', (done) => {
        let user = factory.build('user')
            .then(user => {
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

    after(() => {
        destroyDB();
    });

    it('should update a user when given the correct credentials', (done) => {
        _user.name = 'John Due';
        request(server)
            .put('/api/user')
            .send({ user : _user })
            .set('x-access-token', _token)
            .expect(200)
            .then((res) => {
                expect(res.body.success).to.be.equal(true);
                done();
            })
            .catch((err) => done(err));
            
    });

    it('should NOT update a user with invalid credentials', (done) => {
        _user.name = 'John Due';
        request(server)
            .put('/api/user')
            .send({ user : _user })
            .set('x-access-token', _token + '5555555')
            .expect(403)
            .then((res) => {
                expect(res.body.success).to.be.equal(false);
                done();
            })
            .catch((err) => done(err));
            
    });

    it('should NOT update a user with invalid ID', (done) => {
        _user._id = 5552554848848;
        request(server)
            .put('/api/user')
            .send({ user : _user })
            .set('x-access-token', _token)
            .expect(500)
            .then((res) => {
                expect(res.body.success).to.be.equal(false);
                done();
            })
            .catch((err) => done(err));
            
    });

    after(() => {
        destroyDB();
    });
});

