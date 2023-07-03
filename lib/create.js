const path = require('path');
const fs = require('fs-extra');
const inquirer = require('inquirer'); // 命令行交互工具
const chalk = require('chalk');
const Creator = require('./Creator');
const PromptModuleAPI = require('./PromptModuleAPI');
const Generator = require('./Generator');
const PackageManager = require('./PackageManager');
const { log } = require('./utils/logger');
const hasExists = require('./utils/file/hasExists');
const { saveOptions, savePreset, rcPath } = require('./utils/options');

async function create(name, options) {
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
    const preset = creator.getPresets()[answers.preset];
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
      generatorList.push(`./generator/${feature}`); 
    });
  }

  // if (answers.packageManager) {
  //   saveOptions({
  //     packageManager: answers.packageManager,
  //   });
  // }

  if (answers.save && answers.saveName && savePreset(answers.saveName, answers)) {
    log();
    log(`Preset ${chalk.yellow(answers.saveName)} saved in ${chalk.yellow(rcPath)}`);
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
    // 执行 ./generator/**/index.js 中的 render() , extendPackage() ,injectImports() ,injectRootOptions() 函数
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
  // 安装依赖
  await pm.install();
  // 创建项目成功的提示
  log();
  log(
    `依赖下载完成! \n`
    + `🎉  Successfully created project ${chalk.yellow(name)}.\n`
    + `👉  Get started with the following commands:\n`
    + `${chalk.cyan(` ${chalk.gray('$')} cd ${name}\n`)}`
    + `${chalk.cyan(` ${chalk.gray('$')} ${pm.bin === 'npm'? 'npm run' : 'yarn'} dev \n`)}`,
  );
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