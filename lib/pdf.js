const puppeteer = require('puppeteer');
const _ = require('lodash');
const url = require('url');
const Boom = require('boom');
const pdfOptions = require('./pdfOptions');
const isURL = require('./helpers/isURL');
const path = require('path');

module.exports = async (request, reply) => {
    const postOptions = {};
    const startTime = new Date().getTime();

    // Write all POST data into the options object, _.set makes it possible
    // to create deeper nested objects with dot divided keys
    // e.g. 'viewport.width': '123' becomes { viewport: { width: '123' } }
    _.each(request.payload, (item, key) => {
        _.set(postOptions, key, item);
    });

    if (typeof postOptions.url === 'undefined' && typeof postOptions.html === 'undefined') {
        return reply(Boom.badRequest('You should either send a url or html field in the request'));
    }

    if (typeof postOptions.html === 'undefined' && !isURL(postOptions.url)) {
        return reply(Boom.badRequest('url is not valid, maybe you\'re missing the protocol? (http://)'));
    }

    const options = pdfOptions(postOptions);
    const {
        filePath,
        emulateMedia,
        landscape,
        scale,
        format,
        displayHeaderFooter,
        margin,
        printBackground,
    } = options;

    try {
        // Start our headless browser
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        // Open a new tab
        const page = await browser.newPage();

        // Emulate media type (e.g. print or screen)
        await page.emulateMedia(emulateMedia);

        // If a URL is given we navigate towards it, otherwise we use
        // raw HTML to render the page
        if (typeof postOptions.url !== 'undefined') {
            await page.goto(postOptions.url);
        } else {
            await page.setContent(postOptions.html);
        }

        // Create the PDF with all of our options
        await page.pdf({
            path: path.resolve(global.BASE_PATH, filePath),
            printBackground,
            landscape,
            scale,
            format,
            displayHeaderFooter,
            margin,
        });

        // Close our headless browser
        browser.close();
    } catch (err) {
        return reply(Boom.badImplementation(err));
    }

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
