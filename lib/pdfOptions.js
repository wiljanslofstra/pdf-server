module.exports = (options) => {
    const ret = {};

    // Page format (e.g. A3, A4, Letter, Tabloid etc.) (default: A4)
    ret.format = (typeof options.format !== 'undefined') ? options.format : 'A4';

    // Should the PDF be in landscape mode (default: false)
    ret.landscape = (typeof options.landscape !== 'undefined') ? !!options.landscape : false;

    // Display header and footer with filename etc. (default: false)
    ret.displayHeaderFooter = (typeof options.displayHeaderFooter !== 'undefined') ? !!options.displayHeaderFooter : false;

    // Scale the page up or down (default: 1)
    ret.scale = (typeof options.scale !== 'undefined') ? parseFloat(options.scale) : 1;

    // Set page media type to render (default: 'screen')
    ret.emulateMedia = (typeof options.emulateMedia !== 'undefined') ? options.emulateMedia : 'screen';

    ret.printBackground = (typeof options.printBackground !== 'undefined') ? options.printBackground : true;

    ret.margin = {
        top: '0cm',
        bottom: '0cm',
        left: '0cm',
        right: '0cm',
    };

    if (typeof options.margin !== 'undefined') {
        _.each(options.margin, (item, key) => {
            _.set(ret.margin, key, item);
        });
    }

    return ret;
};
