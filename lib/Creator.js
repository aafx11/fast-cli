const chalk = require('chalk');
const loadRemotePreset = require('./utils/loadRemotePreset');
const {
  defaults,
  loadOptions,
} = require('./utils/options');

const isManualMode = answers => answers.preset === '__manual__';

class Creator {
  constructor() {
    const { presetPrompt, featurePrompt } = this.getDefaultPrompts();
    // this.getDefaultPrompts();
    this.presetPrompt = presetPrompt;
    this.featurePrompt = featurePrompt;
    this.injectedPrompts = [];
  }

  // 获取默认配置和用户已经保存的配置
  getPresets() {
    const savedOptions = loadOptions();
    return { ...savedOptions.presets, ...defaults.presets };
  }

  // 获取默认提示
  getDefaultPrompts() {
    const presets = this.getPresets();
    console.log(`${chalk.red('presets')}`, presets);

    const presetChoices = Object.entries(presets).map(([name, preset]) => {
      let displayName = name;
      return {
        name: `${displayName} (${chalk.yellow(`${preset.features}`)})`,
        value: name,
      };
    });

    const presetPrompt = {
      name: 'preset',
      type: 'list',
      message: `Please pick a preset:`,
      choices: [
        ...presetChoices,
        {
          name: 'Manually select features',
          value: '__manual__',
        },
      ],
    };

    const featurePrompt = {
      name: 'features',
      when: isManualMode,
      type: 'checkbox',
      message: 'Check the features needed for your project:',
      choices: [],
      pageSize: 10,
    };

    return {
      presetPrompt,
      featurePrompt,
    };
  }

  // 获取包管理的提示词
  getPackageManagerPrompts() {
    const savedOptions = loadOptions();
  }

  // 获取是否保存预设的提示词
  getSavePresetPrompts() {
    return [
      {
        name: 'save',
        when: isManualMode,
        type: 'confirm',
        message: 'Save this as a preset for future projects?',
        default: false,
      },
      {
        name: 'saveName',
        when: answers => answers.save,
        type: 'input',
        message: 'Save preset as:',
      },
    ];
  }

  // 获取最终的提示词
  getFinalPrompts() {
    this.injectedPrompts.forEach(prompt => {
      const originalWhen = prompt.when || (() => true);
      prompt.when = answers => isManualMode(answers) && originalWhen(answers);
    });
  
    const prompts = [
      this.presetPrompt,
      this.featurePrompt,
      ...this.injectedPrompts,
      ...this.getSavePresetPrompts(),
    ];
  
    console.log(`${chalk.red(prompts)}`, prompts);
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