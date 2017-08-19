const { expect, it, experiment, after } = exports.lab = require('lab').script();
const removeDir = require('../lib/helpers/removeDir');

const Server = require('../index');
const config = require('../config');

const authorizationHeader = `Basic ${config.keys[0]}`;

experiment('PDF', () => {
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
            done();
        });
    });

    it('Should return an error when no URL is given', (done) => {

        Server.inject({
            method: 'POST',
            url: '/pdf',
            headers: {
                authorization: authorizationHeader,
            },
        }, (response) => {
            expect(response.statusCode).to.equal(400);
            expect(response.result.error).to.equal('Bad Request');
            done();
        });
    });

    it('Should return an error when a wrong URL is given', (done) => {

        Server.inject({
            method: 'POST',
            url: '/pdf',
            payload: {
                url: 'wrong.url',
            },
            headers: {
                authorization: authorizationHeader,
            },
        }, (response) => {
            expect(response.statusCode).to.equal(400);
            expect(response.result.error).to.equal('Bad Request');
            done();
        });
    });

    it('Should create a PDF when only a URL is passed', (done) => {

        Server.inject({
            method: 'POST',
            url: '/pdf',
            payload: {
                url: 'https://www.wiljanslofstra.com/',
            },
            headers: {
                authorization: authorizationHeader,
            },
        }, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.result.message.path).to.be.a.string();
            done();
        });
    });

    it('Should create a PDF from HTML', (done) => {

        Server.inject({
            method: 'POST',
            url: '/pdf',
            payload: {
                html: '<h1>Hello world</h1>',
            },
            headers: {
                authorization: authorizationHeader,
            },
        }, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.result.message.path).to.be.a.string();
            done();
        });
    });

    it('Should create a PDF with all options', (done) => {

        Server.inject({
            method: 'POST',
            url: '/pdf',
            payload: {
                url: 'https://www.wiljanslofstra.com/',
                format: 'A3',
                landscape: true,
                displayHeaderFooter: true,
                scale: 1.5,
                emulateMedia: 'screen',
                printBackground: true,
                'margin.top': '5cm',
                'margin.bottom': '5cm',
                'margin.left': '5cm',
                'margin.right': '5cm',
            },
            headers: {
                authorization: authorizationHeader,
            },
        }, (response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.result.message.path).to.be.a.string();
            done();
        });
    });

    after((done) => {
        // Empty PDF directory
        removeDir('pdf/');
        done();
    });
});
