const transforms = require('./utils/configTransforms');

const chalk = require('chalk');

class ConfigTransform {
    constructor(options) {
        this.fileDescriptor = options.file;
        // fileDescriptor
        // {
        //     js: ['postcss.config.js'],
        //     json: ['.postcssrc.json', '.postcssrc'],
        //     yaml: ['.postcssrc.yaml', '.postcssrc.yml'],
        // }
    }

    transform(value, context) {
        let file;
        if (!file) {
            file = this.getDefaultFile();
        }
        const { type, filename } = file;
        const transform = transforms[type];
        let source;

        const content = transform.write({
            source,
            filename,
            context,
            value,
        });

        return {
            filename,
            content,
        };
    }

    getDefaultFile() {
        const [type] = Object.keys(this.fileDescriptor);
        const [filename] = this.fileDescriptor[type];

        return { type, filename };
    }
}

module.exports = ConfigTransform;