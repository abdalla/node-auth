import { expect } from 'chai';
import request from 'supertest';
import factory from '../factory';
import server from '../../server';
import { createDB, destroyDB } from '../test-helper';
//import { getToken } from '../../src/utils/functions';

describe('Users', () => {
    before((done) => {
        createDB(() => {
            done();
        });
    });

    it('should setup a user for test', (done) => {
        let user = factory.build('user')
            .then(user => {
                request(server)
                    .get('/api/setup')
                    .expect(200)
                    .then((res) => {
                        expect(res.body.success).to.be.equal(true);
                        done();
                    });
            });
    });

    it('should register a user when given the correct credentials', (done) => {
        let user = factory.build('user')
            .then(user => {
                request(server)
                    .post('/api/user')
                    .send({ user : user })
                    .expect(200)
                    .then((res) => {
                        expect(res.body.success).to.be.equal(true);
                        expect(res.body.user).to.be.an('object');
                        done();
                    });
            });
    });

    it('should authenticate user', (done) => {
        let user = factory.build('user')
            .then(user => {
                request(server)
                    .post('/api/user')
                    .send({ user : user })
                    .then(res => {
                        const user = res.body.user;
                        request(server)
                            .post('/api/auth')
                            .send({ email: user.email, password: user.password })
                            .expect(200)
                            .then((res) => {
                                expect(res.body.success).to.be.equal(true);
                                expect(res.body.token).to.be.an('string');
                                done();
                            });
                    });
                    
            });
    });


    after(() => {
        destroyDB();
    });
});

