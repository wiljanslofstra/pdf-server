const puppeteer = require('puppeteer');
const _ = require('lodash');
const moment = require('moment');
const url = require('url');
const Boom = require('boom');

function isURL(str) {
    const urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
    const url = new RegExp(urlRegex, 'i');
    return str.length < 2083 && url.test(str);
}

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

    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    // Doesn't work at the moment but will in future versions of Puppeteer
    // if (typeof options.emulateMedia !== 'undefined') {
    //     await page.emulateMedia('print');
    // }

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

    const timestamp = moment().format('DD_MM_YYYY_HH_mm_ss');
    const filePath = `screenshots/${encodeURIComponent(urlObj.host)}_${timestamp}.png`;

    await page.goto(options.url);
    await page.screenshot({
        path: filePath,
        omitBackground: false,
    });

    browser.close();

    const time = new Date().getTime() - startTime;

    return reply({
        statusCode: 200,
        message: {
            file: filePath,
            time,
        },
    });
};
