const Boom = require('boom');
const url = require('url');
const config = require('../config');
const isURL = require('./helpers/isURL');

const auth = {
    register: function (server, options, next) {
        server.auth.scheme('basic', (authServer, authOptions) => {
            return {
                authenticate: (request, reply) => {
                    if (typeof request.headers.authorization === 'undefined') {
                        return reply(Boom.unauthorized('No authorization headers given'));
                    }

                    const parts = request.headers.authorization.split(/\s+/);

                    // You should use Basic authorization (e.g. 'Basic 123456')
                    if (parts[0].toLowerCase() !== 'basic') {
                        return reply(Boom.unauthorized('Not using basic authorization in the authorization header'));
                    }

                    // The authorization header should contain two parts, first the type
                    // and secondly the 'payload'
                    if (parts.length !== 2) {
                        return reply(Boom.unauthorized('Wrong format given for authorization header'));
                    }

                    const key = parts[1];

                    if (config.keys.indexOf(key) < 0) {
                        return reply(Boom.unauthorized('Wrong key'));
                    }

                    return reply.continue({
                        credentials: {
                            id: '123',
                            name: '1234',
                        },
                    });
                },
                payload: (request, reply) => {
                    if (config.whitelist && request.payload && typeof request.payload.url !== 'undefined') {
                        if (!isURL(request.payload.url)) {
                            return reply(Boom.forbidden('The data contains an invalid URL'));
                        }

                        const parsed = url.parse(request.payload.url);

                        if (config.whitelist.indexOf(parsed.host) < 0) {
                            return reply(Boom.forbidden('The URL is not in the whitelist, either add it or set the whitelist to false'));
                        }
                    }

                    reply.continue();
                },
            };
        });

        next();
    },
};

auth.register.attributes = {
    name: 'auth',
    version: '1.0.0'
};

module.exports = auth;
