const puppeteer = require('puppeteer');
const _ = require('lodash');
const url = require('url');
const Boom = require('boom');
const uniqueFilename = require('./helpers/uniqueFilename');
const isURL = require('./helpers/isURL');
const path = require('path');

module.exports = async (request, reply) => {
    const options = {};
    const startTime = new Date().getTime();

    // Write all POST data into the options object, _.set makes it possible
    // to create deeper nested objects with dot divided keys
    // e.g. 'viewport.width': '123' becomes { viewport: { width: '123' } }
    _.each(request.payload, (item, key) => {
        _.set(options, key, item);
    });

    if (typeof options.url === 'undefined') {
        return reply(Boom.badRequest('url field is missing from the request'));
    }

    if (!isURL(options.url)) {
        return reply(Boom.badRequest('url is not valid, maybe you\'re missing the protocol? (http://)'));
    }

    const urlObj = url.parse(options.url);

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    await page.emulateMedia((typeof options.emulateMedia !== 'undefined') ? options.emulateMedia : 'screen');

    if (typeof options.viewport !== 'undefined') {
        const { width, height } = options.viewport;

        if (isNaN(width) || isNaN(height)) {
            return reply(Boom.badRequest('width or height for the viewport are not numerical'));
        }

        await page.setViewport({
            width: parseInt(width, 10),
            height: parseInt(height, 10),
        });
    }

    const filePath = uniqueFilename(`screenshots/${encodeURIComponent(urlObj.host)}.png`);

    await page.goto(options.url);
    await page.screenshot({
        path: path.resolve(global.BASE_PATH, filePath),
        omitBackground: false,
    });

    browser.close();

    const time = new Date().getTime() - startTime;

    return reply({
        statusCode: 200,
        message: {
            path: filePath,
            options,
            time,
        },
    });
};
