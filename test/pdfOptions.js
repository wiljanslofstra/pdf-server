const { expect, it, experiment, after } = exports.lab = require('lab').script();

const pdfOptions = require('../lib/pdfOptions');
const config = require('../config');

const authorizationHeader = `Basic ${config.keys[0]}`;

experiment('PDF options', () => {
    it('Should create an object with all options when nothing is given', (done) => {

        const options = pdfOptions();

        expect(options.margin).to.be.a.object();
        expect(options.margin).to.equal({
            top: '0cm',
            bottom: '0cm',
            left: '0cm',
            right: '0cm',
        });
        expect(options.format).to.be.a.string();
        expect(options.format).to.equal('A4');
        expect(options.landscape).to.be.a.boolean();
        expect(options.landscape).to.equal(false);
        expect(options.displayHeaderFooter).to.be.a.boolean();
        expect(options.displayHeaderFooter).to.equal(false);
        expect(options.emulateMedia).to.be.a.string();
        expect(options.emulateMedia).to.equal('screen');
        expect(options.filePath).to.be.a.string();
        expect(options.scale).to.be.a.number();
        expect(options.scale).to.equal(1);

        done();
    });

    it('Should create an object with all options when options are given', (done) => {

        const options = pdfOptions({
            margin: {
                top: '1cm',
                bottom: '1cm',
                left: '1cm',
                right: '1cm',
            },
            landscape: true,
            displayHeaderFooter: true,
            emulateMedia: 'print',
            scale: 1.5,
            format: 'A3',
        });

        expect(options.margin).to.be.a.object();
        expect(options.margin).to.equal({
            top: '1cm',
            bottom: '1cm',
            left: '1cm',
            right: '1cm',
        });
        expect(options.format).to.be.a.string();
        expect(options.format).to.equal('A3');
        expect(options.landscape).to.be.a.boolean();
        expect(options.landscape).to.equal(true);
        expect(options.displayHeaderFooter).to.be.a.boolean();
        expect(options.displayHeaderFooter).to.equal(true);
        expect(options.emulateMedia).to.be.a.string();
        expect(options.emulateMedia).to.equal('print');
        expect(options.filePath).to.be.a.string();
        expect(options.scale).to.be.a.number();
        expect(options.scale).to.equal(1.5);

        done();
    });

    after((done) => {
        done();
    });
});
