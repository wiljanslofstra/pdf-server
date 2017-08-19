const puppeteer = require('puppeteer');

module.exports = async (request, reply) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.orangetalent.nl');
    await page.screenshot({ path: 'example.png' });

    browser.close();

    reply('ok');
};
