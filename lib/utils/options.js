const fs = require('fs-extra');
const cloneDeep = require('lodash.clonedeep');
const { getRcPath } = require('./rcPath');
const { error } = require('./logger');
const chalk = require('chalk');
const rcPath = exports.rcPath = getRcPath('.fastrc');

// 默认配置项
exports.defaultPreset = {
  features: ['vue', 'webpack', 'babel', 'router', 'vuex', 'linter'],
  historyMode: false,
  eslintConfig: 'airbnb',
  lintOn: ['save'],
};

exports.defaults = {
  packageManager: undefined,
  useTaobaoRegistry: undefined,
  presets: {
    default: { ...exports.defaultPreset },
  },
};

let cachedOptions;
// 加载已保存的设置
exports.loadOptions = () => {
  if (cachedOptions) {
    return cachedOptions;
  }
  if (fs.existsSync(rcPath)) {
    try {
      cachedOptions = JSON.parse(fs.readFileSync(rcPath, 'utf-8'));
    } catch (error) {
      error(
        `Error loading saved preferences: `
        + `~/.fastrc may be corrupted or have syntax errors. `
        + `Please fix/delete it and re-run vue-cli in manual mode.\n`
        + `(${error.message})`,
      );
    }
    return cachedOptions;
  }
  return {};
};

// 保存设置
exports.saveOptions = (toSave) => {
  const options = Object.assign(cloneDeep(exports.loadOptions()), toSave);
  for (const key in options) {
    // 只需要保存 defaults 中有的 key
    if (!(key in exports.defaults)) {
      delete options[key];
    }
  }
  cachedOptions = options;
  try {
    fs.writeFileSync(rcPath, JSON.stringify(options, null, 2));
    return true;
  } catch (e) {
    error(
      `Error saving preferences: `
    + `make sure you have write access to ${rcPath}.\n`
    + `(${e.message})`,
    );
  }
};

// 保存预设
exports.savePreset = (name, preset) => {
  preset = filter(preset);
  const presets = cloneDeep(exports.loadOptions().presets || {});
  presets[name] = preset;

  return exports.saveOptions({ presets });
};

// 保存预设前去除一些与预设无关的属性
function filter(preset, keys = ['preset', 'save', 'saveName', 'packageManager']) {
  preset = { ...preset };
  keys.forEach(key => {
    delete preset[key];
  });

  return preset;
}