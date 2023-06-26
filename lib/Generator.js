const fs = require('fs-extra');
const path = require('path');
const { runTransformation } = require('vue-codemod');
const { isBinaryFileSync } = require('isbinaryfile');
const ejs = require('ejs');
const sortObject = require('./utils/sortObject');
const ConfigTransform = require('./ConfigTransform');
const normalizeFilePaths = require('./utils/normalizeFilePaths');

const chalk = require('chalk');
const writeFileTree = require('./utils/writeFileTree');

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
        this.files = {}; // 存储最终需要生成的文件，以及文件相应的路径
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

    // 使用 ejs 解析模板文件,并加载模板文件到内存
    render(source, additionalData = {}, ejsOptions = {}) {
        // 获取调用 generator.render() 函数的文件的父目录路径,baseDir xx\lib\generator\xx
        const baseDir = extractCallDir();
        // 模板文件的路径,source xx\lib\generator\xx\template
        source = path.resolve(baseDir, source);

        // 往 fileMiddlewares 数组里 push 函数
        this._injectFileMiddleware(async (files) => {
            // 合并后的选项
            const data = this._resolveData(additionalData);
            // https://github.com/sindresorhus/globby
            const globby = require('globby');
            // 读取template目录下所有的文件
            const _files = await globby(['**/*'], { cwd: source, dot: true });
            for (const rawPath of _files) {
                const sourcePath = path.resolve(source, rawPath);
                // 解析文件内容,content 为经过 ejs 解析后的字符串，或者是二进制文件
                const content = this.renderFile(sourcePath, data, ejsOptions);
                // only set file if it's not all whitespace, or is a Buffer (binary files)
                if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
                    // 存进 files 里
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
        // console.log(`${chalk.red('template')},`, template);
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
        console.log(`${chalk.red('configTransforms')}`, configTransforms);
        console.log(`${chalk.red('pkg')}`, this.pkg);
        const extract = (key) => {
            if (configTransforms[key] && this.pkg[key]) {
                console.log(`${chalk.red('key')}`, key);
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

    // 执行 generate 前已经加载完相应的模板了
    // 将所有模板文件写入目录中
    async generate() {
        // 从 package.json 中提取文件
        this.extractConfigFiles();
        // 解析文件内容
        await this.resolveFiles();
        // 将 package.json 中的字段排序
        this.sortPkg();
        this.files['package.json'] = JSON.stringify(this.pkg, null, 2) + '\n';
        // 将所有文件写入到用户要创建的目录
        await writeFileTree(this.context, this.files);
    }
    
    // 使用 ejs 解析文件,注入 import 语句和 new Vue() 选项
    async resolveFiles() {
        const files = this.files;
        for (const middleware of this.fileMiddlewares) {
            // 使用 ejs 解析 lib\generator\xx\template 中的文件
            await middleware(files, ejs.render);
        }

        // normalize file paths on windows
        // all paths are converted to use / instead of \
        // 将路径的反斜杠 \ 转换为正斜杠 /
        normalizeFilePaths(files);

        // 处理 import 语句的导入和 new Vue() 选项的注入
        // vue-codemod 库，对代码进行解析得到 AST，再将 import 语句和根选项注入
        Object.keys(files).forEach(filePath => {
            let imports = this.imports[filePath];
            // console.log(`${chalk.red('imports')}`, imports);
            imports = imports instanceof Set ? Array.from(imports) : imports;

            if (imports && imports.length > 0) {
                // https://github.com/vuejs/vue-codemod
                files[filePath] = runTransformation(
                    { path: filePath, source: files[filePath] },
                    require('./utils/inject/injectImports'),
                    { imports },
                );
            }

            let injections = this.rootOptions[filePath];
            injections = injections instanceof Set ? Array.from(injections) : injections;
            if (injections && injections.length > 0) {
                files[filePath] = runTransformation(
                    { path: filePath, source: files[filePath] },
                    require('./utils/inject/injectOptions'),
                    { injections },
                );
            }
        });
    }

    // 将导入语句用 Set 保存到 imports 中
    injectImports(filePath, imports) {
        const _imports = (
            this.imports[filePath]
            || (this.imports[filePath] = new Set())
        );
        (Array.isArray(imports) ? imports : [imports]).forEach(imp => {
            _imports.add(imp);
        });
    }

    // 将需要在Vue中初始化的插件用 Set 保存到 rootOptions 中
    injectRootOptions(filePath, options) {
        const _options = (
            this.rootOptions[filePath]
            || (this.rootOptions[filePath] = new Set())
        );
        (Array.isArray(options) ? options : [options]).forEach(opt => {
            _options.add(opt);
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

    // 在 lib\generator\xx\index.js 等各个模块中 调用 generator.render()
    // 将会排在调用栈中的第四个，也就是 obj.stack.split('\n')[3]
    const callSite = obj.stack.split('\n')[3];
    /**
     * obj.stack.split 
     * 函数调用了 Generator 中的 render() 方法，
     * render 中调用了 extractCallDir() 方法,
     * 所以数组下标3是调用 generator.render() 函数的文件的父目录路径
     * [
     *   'Error',
     *    at extractCallDir,
     *    at Generator.render,
     *    at module.exports,
     * ]
     * 
     */
    // console.log(`${chalk.red('stack')}`, callSite);
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