const puppeteer = require('puppeteer');
const _ = require('lodash');
const url = require('url');
const Boom = require('boom');
const uniqueFilename = require('./helpers/uniqueFilename');
const pdfOptions = require('./pdfOptions');

function isURL(str) {
    const urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
    const url = new RegExp(urlRegex, 'i');
    return str.length < 2083 && url.test(str);
}

module.exports = async (request, reply) => {
    const postOptions = {};
    const startTime = new Date().getTime();

    // Write all POST data into the options object, _.set makes it possible
    // to create deeper nested objects with dot divided keys
    // e.g. 'viewport.width': '123' becomes { viewport: { width: '123' } }
    _.each(request.payload, (item, key) => {
        _.set(postOptions, key, item);
    });

    if (typeof postOptions.url === 'undefined') {
        return reply(Boom.badRequest('url field is missing from the request'));
    }

    if (!isURL(postOptions.url)) {
        return reply(Boom.badRequest('url is not valid, maybe you\'re missing the protocol? (http://)'));
    }

    const urlObj = url.parse(postOptions.url);

    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    const filePath = uniqueFilename(`pdf/${encodeURIComponent(urlObj.host)}.pdf`);

    const options = pdfOptions(postOptions);
    const {
        emulateMedia,
        landscape,
        scale,
        format,
        displayHeaderFooter,
        margin,
        printBackground,
    } = options;

    await page.emulateMedia(emulateMedia);

    await page.goto(postOptions.url);

    await page.pdf({
        path: filePath,
        printBackground,
        landscape,
        scale,
        format,
        displayHeaderFooter,
        margin,
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
