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

    describe('Create', () => {
        it('should register a user when given the correct credentials', (done) => {
            let user = factory.build('user');

            request(server)
                .post('/users')
                .send({ user })
                .expect(200)
                .then((res) => {
                    expect(res.body.user).to.be.an('object');
                    done();
                });
        });
    });

    after(() => {
        destroyDB();
    });
});

