const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 3000, host: 'localhost' });

const handlePDF = require('./lib/pdf');
const handleScreenshot = require('./lib/screenshot');

server.register(require('./lib/auth'), (err) => {
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
