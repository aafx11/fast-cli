const stripAnsi = require('strip-ansi'); // 用于去除字符串中ANSI转义序列的Node.js模块
const { hasProjectYarn } = require('./utils/env');

const PACKAGE_MANAGER_CONFIG = {
  npm: {
    install: ['install'],
  },
  yarn: {
    install: [],
  },
};

// 包管理
class PackageManager {
  constructor(context, packageManager) {
    this.context = context;
    this._registries = {};

    if (packageManager) {
      this.bin = packageManager;
    } else if (context) {
      if (hasProjectYarn(context)) {
        this.bin = 'yarn';
      } else {
        this.bin = 'npm';
      }
    }
  }

  async setRegistry() {
    const cacheKey = '';
    if (this._registries[cacheKey]) {
      return this._registries[cacheKey];
    }
  }
}