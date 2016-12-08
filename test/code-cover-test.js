'use strict';
import chai, { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import requiredToken from '../src/controllers/middleware/required-token';
import { createDB, destroyDB } from './test-helper';
import apiController from'../src/controllers/api-controller';
import config from '../src/config';

const validToken = (token, cb) => {
    if (token) {
        jwt.verify(token, options.publicKey, function(err, decoded) {
            if (err) {
                return cb('Failed to authenticate token');
            } else {
                return cb(null, decoded);
            }
        });
    } else {
        return cb('Token is required.');
    }
};

describe('Middleware', () => {
    before((done) => {
        chai.config.includeStack = true;
        createDB(() => {
            done();
        });
    });

    it('Should get an erro if publicKey property doesnt exists on options passed to middleware', (done) => {
       const app = express();
       app.use(requiredToken({}, validToken));
       const server = app.listen('5054');
       request(server)
            .post('/api/setup')
            .expect(500)
            .then((res) => {
                expect(res.text).to.be.equal('publicKey is required\n');
                server.close();
                done();
            })
            .catch((err) => {
                server.close();
                done(err);
            });
    });

    it('Should get a message "The API is at...."', (done) => {
       const options = { publicKey: 'token', ignoredRoutes: ['/api'] };
       const app = express();
       app.use(requiredToken(options, validToken));

       apiController(app, config);

       const server = app.listen('5054');
       request(server)
            .get('/api')
            .expect(200)
            .then((res) => {
                expect(res.text).to.be.equal('The API is at http://url/api');
                server.close();
                done();
            })
            .catch((err) => {
                server.close();
                done(err);
            });
    });

    after(() => {
        destroyDB();
    });
});