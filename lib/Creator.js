const chalk = require('chalk');
const loadRemotePreset = require('./utils/loadRemotePreset');

class Creator {
  constructor() {
    this.featurePrompt = {
      name: 'features',
      message: 'Check the features needed for your project:',
      pageSize: 10,
      type: 'checkbox',
      choices: [],
    };
    this.injectedPrompts = [];
  }

  // 获取默认提示
  getDefaultPrompts() {

  }

  getFinalPrompts() {
    this.injectedPrompts.forEach(prompt => {
      const originalWhen = prompt.when || (() => true);
      prompt.when = answers => originalWhen(answers);
    });

    const prompts = [
      this.featurePrompt,
      ...this.injectedPrompts,
    ];

    return prompts;
  }

  // 获取远程仓库预设
  async resolvePreset(name) {
    console.log(`${chalk.red('执行')}`, name);
    try {
      return await loadRemotePreset(name);
    } catch (error) {
      console.log(`${chalk.red('error')}`, error);
    }
  }
}

module.exports = Creator;