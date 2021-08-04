const jFile = require('jsonfile');

exports.readDataFromFile = function (file) {
    return new Promise((resolve, reject) => {
        jFile.readFile(file, function (err, obj) {
            if (err) {
                reject(err);
            }
            else {
                resolve(obj);
            }
        })
    })
}

