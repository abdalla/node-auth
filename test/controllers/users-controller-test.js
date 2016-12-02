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
            });
    });

    let _token = '';
    it('should authenticate using the user created on setup', (done) => {
        _user.password = 'abdallah'; //did it only to pass on the test...
        request(server)
            .post('/api/auth')
            .send({ email: _user.email, password: _user.password })
            .expect(200)
            .then((res) => {
                _token = res.body.token;
                expect(res.body.success).to.be.equal(true);
                expect(res.body.token).to.be.an('string');
                done();
            });
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
                    .catch((err) => console.log(err));
            });
    });

    after(() => {
        destroyDB();
    });
});

