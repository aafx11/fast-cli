const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');

// 从临时目录中加载预设
module.exports = async function loadPresetFromDir(dir) {
  console.log(`${chalk.red('dir')}`, dir);
  // if the preset dir contains generator.js or generator/index.js, we will inject it as a hidden
  // plugin so it will be invoked by the generator.
  const hasGenerator = fs.existsSync(path.join(dir, 'generator.js')) || fs.existsSync(path.join(dir, 'generator/index.js'));
  if (!hasGenerator) {
    throw new Error('remote preset does not generator.js!');
  }

  // 如果有 prompts 提示词，就先执行提示词获取选项
  const hasPrompts = fs.existsSync(path.join(dir, 'prompts.js')) || fs.existsSync(path.join(dir, 'prompts/index.js'));
  console.log(`${chalk.red('hasGenerator')}`, hasGenerator);
  console.log(`${chalk.red('hasPrompts')}`, hasPrompts);
  console.log(`${chalk.red('prompts.js')}`, require(path.join(dir, 'prompts.js')));
  return {
    prompts: hasPrompts ? require(path.join(dir, 'prompts.js')) : [],
    remoteGenerator: path.join(dir, 'generator.js'),
    dir,
  };
};