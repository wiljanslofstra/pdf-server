const moment = require('moment');
const path = require('path');

module.exports = (name) => {
    const timestamp = moment().format('DD_MM_YYYY_HH_mm_ss');
    const parsed = path.parse(name);
    return `${parsed.dir}/${parsed.name}_${timestamp}${parsed.ext}`;
};
