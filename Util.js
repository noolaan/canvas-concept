const sizeOf = require('image-size');

class Util {

    constructor() {
        throw new Error("Class may not be instantiated.");
    }

    static imageDimensions(source) {
        return new Promise((resolve, reject) => {
            sizeOf(source, (error, dimensions) => {
                if(error) return reject();
                else return resolve(dimensions);
            });
        });
    }

}

module.exports = Util;