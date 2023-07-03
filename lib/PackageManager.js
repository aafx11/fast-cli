const stripAnsi = require('strip-ansi'); // 用于去除字符串中ANSI转义序列的Node.js模块
const execa = require('execa');
const chalk = require('chalk');
const { hasProjectYarn } = require('./utils/env');
const registries = require('./utils/registries');
const shouldUseTaobao = require('./utils/shouldUseTaobao');
const { log } = require('./utils/logger');
const executeCommand = require('./utils/executeCommand');

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

  // 设置用哪个源
  async setRegistry() {
    const cacheKey = '';
    if (this._registries[cacheKey]) {
      return this._registries[cacheKey];
    }
    let registry;
    if (await shouldUseTaobao(this.bin)) {
      registry = registries.taobao;
    } else {
      try {
        if (!registry || registry === 'undefined') {
          // 如果不使用 taobao 源，就获取用户现在设置的源地址
          registry = (await execa(this.bin, ['config', 'get', 'registry'])).stdout;
        }
      } catch (error) {
        // Yarn 2 uses `npmRegistryServer` instead of `registry`
        registry = (await execa(this.bin, ['config', 'get', 'npmRegistryServer'])).stdout;
      }
    }

    // trim() 去除字符串两端的空格
    this._registries[cacheKey] = stripAnsi(registry).trim();
    return this._registries[cacheKey];
  }

  async runCommand(command, args) {
    const prevNodeEnv = process.env.NODE_ENV;
    // In the use case of Vue CLI, when installing dependencies,
    // the `NODE_ENV` environment variable does no good;
    // it only confuses users by skipping dev deps (when set to `production`).
    delete process.env.NODE_ENV;

    await this.setRegistry();
    await executeCommand(
      this.bin,
      [
        ...PACKAGE_MANAGER_CONFIG[this.bin][command],
        ...(args || []),
      ],
      this.context,
    );

    if (prevNodeEnv) {
      process.env.NODE_ENV = prevNodeEnv;
    }
  }

  async install() {
    log('\n正在下载依赖...\n');
    return await this.runCommand('install');
  }
}

module.exports = PackageManager;