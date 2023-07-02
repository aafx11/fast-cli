const path = require('path');
const fs = require('fs-extra');
// 命令行交互工具
const inquirer = require('inquirer');
const chalk = require('chalk');
const hasExists = require('./utils/file/hasExists');
const Creator = require('./Creator');
const PromptModuleAPI = require('./PromptModuleAPI');
const Generator = require('./Generator');
const PackageManager = require('./PackageManager');

async function create(name, options) {
  console.log(`\r\n${chalk.red(`>>>>>>>>create.js参数:`)}`, name, options);
  // 执行命令行的当前目录
  const cwd = process.cwd();
  // 需要创建的目录地址
  const targetDir = path.join(cwd, name);

  // 目录是否已经存在,如果存在询问用户是否覆盖
  await hasExists(targetDir, options);

  const creator = new Creator();

  let finalprompts, generatorList=[];
  // 如果有远程预设
  if (options.preset) {
    let { prompts, remoteGenerator } = await creator.resolvePreset(options.preset);
    finalprompts = prompts;
    generatorList.push(remoteGenerator);
    console.log(`${chalk.red('remote-prompts')}`, prompts);
  } else {
  // 获取各个模块的交互提示语,promptModules 为注入提示语函数的数组
    const promptModules = getPromptModules();
    
    const promptAPI = new PromptModuleAPI(creator);
    // 调用 PromptModuleAPI 将所有交互提示语注入到 creator 对象
    promptModules.forEach(m => m(promptAPI));

    finalprompts = creator.getFinalPrompts();
  }

  // 弹出交互提示语并获取用户的选择
  const answers = await inquirer.prompt(finalprompts);
  // answers 为用户所选的选项
  // {
  //     features: [ 'vue', 'webpack', 'babel', 'router', 'vuex', 'linter' ], // 项目具有的功能
  //     historyMode: true, // 路由是否使用 history 模式
  //     eslintConfig: 'airbnb', // esilnt 校验代码的默认规则，可被覆盖
  //     lintOn: [ 'save' ] // 保存代码时进行校验
  // }

  // 用户选择了默认配置,根据默认配置生成 answers
  if (answers.preset !== '__manual__') {
    console.log(`${chalk.red('answers.preset')}`, answers.preset);
    const preset = creator.getPresets()[answers.preset];
    console.log(`${chalk.red('preset')}`, preset);
    Object.keys(preset).forEach(key => {
      answers[key] = preset[key];
    });
  }

  // 不是远程预设的情况,并且不是默认配置
  if (!options.preset && answers.preset === '__manual__') {
    // 填入 vue webpack 必选项，无需用户选择
    answers.features.unshift('vue', 'webpack');
  }

  if (!options.preset) {
    answers.features.forEach(feature => {
      // 执行 ./generator/**/index.js 中的 render() , extendPackage() ,injectImports() ,injectRootOptions() 函数
      generatorList.push(`./generator/${feature}`); 
    });
  }

  // package.json 文件内容
  const pkg = options.preset?{}: {
    name,
    version: '0.1.0',
    dependencies: {},
    devDependencies: {},
  };

  const generator = new Generator(pkg, targetDir);

  generatorList.forEach(g => {
    require(`${g}`)(generator, answers);
  });

  // 没有远程库预设
  // // 根据用户选择的选项加载相应的模块，在 package.json 写入对应的依赖项
  // // 并且将对应的 template 文件创建到硬盘
  // answers.features.forEach(feature => {
  //   // 执行 ./generator/**/index.js 中的 render() , extendPackage() ,injectImports() ,injectRootOptions() 函数
  //   require(`./generator/${feature}`)(generator, answers);
  // });
  options.preset? await generator.generateByRemote() : await generator.generate();
  const pm = new PackageManager(targetDir, answers.packageManager);
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