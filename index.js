const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 3000, host: 'localhost' });

const handlePDF = require('./lib/handlePDF');

server.register(require('./lib/auth'), (err) => {
    server.auth.strategy('simple', 'basic');

    server.route({
        method: 'POST',
        path: '/',
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
