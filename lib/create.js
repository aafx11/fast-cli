const path = require('path');
const fs = require('fs-extra');
// 命令行交互工具
const inquirer = require('inquirer');
const chalk = require('chalk');
const Creator = require('./Creator');
const PromptModuleAPI = require('./PromptModuleAPI');
const Generator = require('./Generator');

async function create(name, options) {
    console.log(`\r\n${chalk.red(`>>>>>>>>create.js参数:`)}`, name, options);
    // 执行命令行的当前目录
    const cwd = process.cwd();
    // 需要创建的目录地址
    const targetAir = path.join(cwd, name);

    // 目录是否已经存在
    if (fs.existsSync(targetAir)) {
        if (options.force) {
            await fs.remove(targetAir);
        } else {
            // 询问用户是否覆盖文件夹
            let { action } = await inquirer.prompt([
                {
                    name: 'action',
                    type: 'list',
                    message: 'Target directory already exists Pick an action:',
                    choices: [
                        {
                            name: 'Overwrite',
                            value: 'overwrite',
                        },
                        {
                            name: 'Cancel',
                            value: false,
                        },
                    ],
                },
            ]);

            if (!action) {
                return;
            } if (action === 'overwrite') {
                // console.log(`\r\nRemoving...`);
                console.log(`\r\n${chalk.red('Removing...')}`);
                await fs.remove(targetAir);
            }
        }
    }

    const creator = new Creator();
    // 获取各个模块的交互提示语,promptModules 为注入提示语函数的数组
    const promptModules = getPromptModules();
    
    const promptAPI = new PromptModuleAPI(creator);
    // 调用 PromptModuleAPI 将所有交互提示语注入到 creator 对象
    promptModules.forEach(m => m(promptAPI));
    // 弹出交互提示语并获取用户的选择
    const answers = await inquirer.prompt(creator.getFinalPrompts());
    // answers 为用户所选的选项
    // {
    //     features: [ 'vue', 'webpack', 'babel', 'router', 'vuex', 'linter' ], // 项目具有的功能
    //     historyMode: true, // 路由是否使用 history 模式
    //     eslintConfig: 'airbnb', // esilnt 校验代码的默认规则，可被覆盖
    //     lintOn: [ 'save' ] // 保存代码时进行校验
    // }

    // 填入 vue webpack 必选项，无需用户选择
    answers.features.unshift('vue', 'webpack');

    // package.json 文件内容
    const pkg = {
        name,
        version: '0.1.0',
        dependencies: {},
        devDependencies: {},
    };
    const generator = new Generator(pkg, targetAir);

    // 根据用户选择的选项加载相应的模块，在 package.json 写入对应的依赖项
    // 并且将对应的 template 文件创建到硬盘
    answers.features.forEach(feature => {
        // 执行 ./generator/**/index.js 中的 render() , extendPackage() ,injectImports() ,injectRootOptions() 函数
        require(`./generator/${feature}`)(generator, answers);
    });
    await generator.generate();
}

function getPromptModules() {
    return [
        'babel',
        'router',
        'vuex',
        'linter',
    ].map(file => require(`./promptModules/${file}`));
}

module.exports = create;