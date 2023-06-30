const fs = require('fs-extra');
const { getRcPath } = require('./rcPath');
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