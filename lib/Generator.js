const fs = require('fs-extra');
const path = require('path');
const { isBinaryFileSync } = require('isbinaryfile');
const ejs = require('ejs');
const sortObject = require('./utils/sortObject');
const ConfigTransform = require('./ConfigTransform');
const normalizeFilePaths = require('./utils/normalizeFilePaths');

const isObject = (val) => val && typeof val === 'object';

const defaultConfigTransforms = {
    babel: new ConfigTransform({
        file: {
            js: ['babel.config.js'],
        },
    }),
    postcss: new ConfigTransform({
        file: {
            js: ['postcss.config.js'],
            json: ['.postcssrc.json', '.postcssrc'],
            yaml: ['.postcssrc.yaml', '.postcssrc.yml'],
        },
    }),
    eslintConfig: new ConfigTransform({
        file: {
            js: ['.eslintrc.js'],
            json: ['.eslintrc', '.eslintrc.json'],
            yaml: ['.eslintrc.yaml', '.eslintrc.yml'],
        },
    }),
    jest: new ConfigTransform({
        file: {
            js: ['jest.config.js'],
        },
    }),
    browserslist: new ConfigTransform({
        file: {
            lines: ['.browserslistrc'],
        },
    }),
};

const reservedConfigTransforms = {
    vue: new ConfigTransform({
        file: {
            js: ['vue.config.js'],
        },
    }),
};

class Generator {
    constructor(pkg, context) {
        this.pkg = pkg;
        this.rootOptions = {};
        this.imports = {};
        this.files = {};
        this.entryFile = `src/main.js`;
        this.fileMiddlewares = [];
        this.context = context;
        this.configTransforms = {};
    }

    // 拓展package.json
    extendPackage(fields) {
        const pkg = this.pkg;
        for (const key in fields) {
            const value = fields[key];
            const existing = pkg[key];
            if (isObject(value) && (['dependencies', 'devDependencies', 'scripts'].includes(key))) {
                pkg[key] = Object.assign(existing || {}, value);
            } else {
                pkg[key] = value;
            }
        }
    }

    // 按照下面的顺序对 package.json 中的 key 进行排序
    sortPkg() {
        // ensure package.json keys has readable order
        this.pkg.dependencies = sortObject(this.pkg.dependencies);
        this.pkg.devDependencies = sortObject(this.pkg.devDependencies);
        this.pkg.scripts = sortObject(this.pkg.scripts, [
            'dev',
            'build',
            'test:unit',
            'test:e2e',
            'lint',
            'deploy',
        ]);

        this.pkg = sortObject(this.pkg, [
            'name',
            'version',
            'private',
            'description',
            'author',
            'scripts',
            'husky',
            'lint-staged',
            'main',
            'module',
            'browser',
            'jsDelivr',
            'unpkg',
            'files',
            'dependencies',
            'devDependencies',
            'peerDependencies',
            'vue',
            'babel',
            'eslintConfig',
            'prettier',
            'postcss',
            'browserslist',
            'jest',
        ]);
    }

    // 在硬盘中创建模板文件
    render(source, additionalData = {}, ejsOptions = {}) {
        // 获取调用 generator.render() 函数的文件的父目录路径
        const baseDir = extractCallDir();
        // 模板文件的路径
        source = path.resolve(baseDir, source);
        this._injectFileMiddleware(async (files) => {
            const data = this._resolveData(additionalData);
            // https://github.com/sindresorhus/globby
            const globby = require('globby');
            // 读取目录中所有的文件
            const _files = await globby(['**/*'], { cwd: source, dot: true });
            for (const rawPath of _files) {
                const sourcePath = path.resolve(source, rawPath);
                // 解析文件内容
                const content = this.renderFile(sourcePath, data, ejsOptions);
                // only set file if it's not all whitespace, or is a Buffer (binary files)
                if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
                    files[rawPath] = content;
                }
            }
        });
    }

    // 注入中间件
    _injectFileMiddleware(middleware) {
        this.fileMiddlewares.push(middleware);
    }

    // 合并选项
    _resolveData(additionalData) {
        return {
            options: this.options,
            rootOptions: this.rootOptions,
            ...additionalData,
        };
    }

    // 解析文件内容
    renderFile(name, data, ejsOptions) {
        // 如果是二进制文件，直接将读取结果返回
        if (isBinaryFileSync(name)) {
            return fs.readFileSync(name); // return buffer
        }

        // 否则返回文件内容
        const template = fs.readFileSync(name, 'utf-8');
        return ejs.render(template, data, ejsOptions);
    }

    // 将 package.json 中的配置提取出来，生成单独的文件
    // 例如将 package.json 中的
    // babel: {
    //     presets: ['@babel/preset-env']
    // },
    // 提取出配置文件 babel.config.js
    extractConfigFiles() {
        const configTransforms = {
            ...defaultConfigTransforms,
            ...this.configTransforms,
            ...reservedConfigTransforms,
        };

        const extract = (key) => {
            if (configTransforms[key] && this.pkg[key]) {
                const value = this.pkg[key];
                const configTransform = configTransforms[key];
                const res = configTransform.transform(
                    value,
                    this.files,
                    this.context,
                );
                const { content, filename } = res;
                // 如果文件不是以 \n 结尾，则补上 \n
                this.files[filename] = ensureEOL(content);
                delete this.pkg[key];
            }
        };

        extract('vue');
        extract('babel');
    }

    async generate() {
        // 从 package.json 中提取文件
        this.extractConfigFiles();
        // 解析文件内容
    }

    // 使用 ejs 解析 lib\generator\xx\template 中的文件
    async resolveFiles() {
        const files = this.files;
        for (const middleware of this.fileMiddlewares) {
            await middleware(files, ejs.render);
        }

        // normalize file paths on windows
        // all paths are converted to use / instead of \
        // 将反斜杠 \ 转换为正斜杠 /
        normalizeFilePaths(files);

        // 处理 import 语句的导入和 new Vue() 选项的注入
        // vue-codemod 库，对代码进行解析得到 AST，再将 import 语句和根选项注入
        Object.keys(files).forEach(file => {
            
        });
    }
}

// 如果文件不是以 \n 结尾，则补上 \n
const ensureEOL = str => {
    if (str.charAt(str.length - 1) !== '\n') {
        return str + '\n';
    }

    return str;
};

// 获取调用栈信息
function extractCallDir() {
    const obj = {};
    Error.captureStackTrace(obj);
    console.log('stack', obj.stack);
    // 在 lib\generator\xx 等各个模块中 调用 generator.render()
    // 将会排在调用栈中的第四个，也就是 obj.stack.split('\n')[3]
    const callSite = obj.stack.split('\n')[3];

    // the regexp for the stack when called inside a named function
    const namedStackRegExp = /\s\((.*):\d+:\d+\)$/;
    // the regexp for the stack when called inside an anonymous
    const anonymousStackRegExp = /at (.*):\d+:\d+$/;

    let matchResult = callSite.match(namedStackRegExp);
    if (!matchResult) {
        matchResult = callSite.match(anonymousStackRegExp);
    }

    const fileName = matchResult[1];
    // 获取对应文件的目录
    return path.dirname(fileName);
}

module.exports = Generator;