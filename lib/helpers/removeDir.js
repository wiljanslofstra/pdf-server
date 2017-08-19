// Source: https://gist.github.com/liangzan/807712

const fs = require('fs');
const path = require('path');

module.exports = function(dirPath) {
    try {
        var files = fs.readdirSync(dirPath);
    }
    catch(e) {
        return;
    }

    if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
            var filePath = path.join(dirPath, files[i]);

            if (fs.statSync(filePath).isFile()) {
                fs.unlinkSync(filePath);
            } else {
                rmDir(filePath);
            }
        }
    }
};
