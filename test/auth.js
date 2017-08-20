const { expect, it, experiment, after } = exports.lab = require('lab').script();

const Server = require('../index');
const config = require('../config');

const authorizationHeader = `Basic ${config.keys[0]}`;

experiment('Auth', () => {
    it('Should return a forbidden with missing API key', (done) => {

        Server.inject({
            method: 'POST',
            url: '/pdf'
        }, (response) => {
            expect(response.statusCode).to.equal(401);
            done();
        });
    });

    it('Should return forbidden with a wrong API key', (done) => {

        Server.inject({
            method: 'POST',
            url: '/pdf',
            headers: {
                authorization: 'Basic 123456',
            },
        }, (response) => {
            expect(response.statusCode).to.equal(401);
            expect(response.result.message).to.contain('key');
            done();
        });
    });

    it('Should return forbidden with a non-whitelisted URL', (done) => {

        Server.inject({
            method: 'POST',
            url: '/pdf',
            headers: {
                authorization: authorizationHeader,
            },
            payload: {
                url: 'https://www.google.nl/',
            },
        }, (response) => {
            expect(response.statusCode).to.equal(403);
            expect(response.result.message).to.contain('whitelist');
            done();
        });
    });

    after((done) => {
        done();
    });
});
