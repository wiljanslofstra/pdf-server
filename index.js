const Hapi = require('hapi');
const Inert = require('inert');
const path = require('path');

const server = new Hapi.Server();
let port = process.env.PORT || 3000;

global.BASE_PATH = __dirname;

if (process.env.NODE_ENV === 'test') {
    port = 4000;
}

server.connection({ port, host: 'localhost' });

const handlePDF = require('./lib/pdf');
const handleScreenshot = require('./lib/screenshot');

server.register(Inert, (err) => {
    server.route({
        method: 'GET',
        path: '/pdf_output/{file*}',
        handler: {
            directory: {
                path: path.resolve(global.BASE_PATH, 'pdf_output'),
                listing: true,
            }
        }
    });
});

server.register([require('./lib/auth')], (err) => {
    server.auth.strategy('simple', 'basic');

    server.route({
        method: 'POST',
        path: '/screenshot',
        handler: handleScreenshot,
        config: {
            auth: {
                mode: 'required',
                strategies: ['simple'],
                payload: 'required',
            },
        },
    });

    server.route({
        method: 'POST',
        path: '/pdf',
        handler: handlePDF,
        config: {
            auth: {
                mode: 'required',
                strategies: ['simple'],
                payload: 'required',
            },
        },
    });
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});

module.exports = server;
