const execa = require('execa');
const chalk = require('chalk');
const { hasYarn } = require('./env');
const request = require('./request');
const registries = require('./registries');
const inquirer = require('inquirer');
const { loadOptions, saveOptions } = require('./options');

function removeSlash(url) {
  return url.replace(/\/$/, '');
}

async function ping(registry) {
  await request.get(`${registry}/vue-cli-version-marker/latest`);
  return registry;
}

let checked;
let result;

module.exports = async function shouldUseTaobao(command) {
  if (!command) {
    command = hasYarn() ? 'yarn' : 'npm';
  }

  // ensure this only gets called once.
  if (checked) return result;
  checked = true;

  // previously saved preference
  const saved = loadOptions().useTaobaoRegistry;
  if (typeof saved === 'boolean') {
    return (result = saved);
  }
    
  const save = val => {
    result = val;
    saveOptions({ useTaobaoRegistry: val });
    return val;
  };

  let userCurrent;
  try {
    // 执行 npm/yarn config get registry 命令获取仓库源地址
    userCurrent = (await execa(command, ['config', 'get', 'registry'])).stdout;
  } catch (error) {
    try {
      // Yarn 2 uses `npmRegistryServer` instead of `registry`
      userCurrent = (await execa(command, ['config', 'get', 'npmRegistryServer'])).stdout;
    } catch (npmRegistryServerError) {
      return save(false);
    }
  }

  // 默认的仓库源地址 https://registry.npmjs.org
  const defaultRegistry = registries[command];
  // 如果 userCurrent 与默认的仓库源地址不相等，说明用户已配置了自定义的源地址
  if (removeSlash(userCurrent) !== removeSlash((defaultRegistry))) {
    return save(false);
  }

  let faster;
  try {
    // 测一下是默认源地址还是 taoao 源返回的速度更快
    faster = await Promise.race([
      ping(defaultRegistry),
      ping(registries.taobao),
    ]);
  } catch (error) {
    return save(false);
  }

  if (faster !== registries.taobao) {
    // default is already faster
    return save(false);
  }

  // 询问是否使用 taobao 源
  const { useTaobaoRegistry } = await inquirer.prompt([
    {
      name: 'useTaobaoRegistry',
      type: 'confirm',
      message: chalk.yellow(
        ` Your connection to the default ${command} registry seems to be slow.\n`
        + `   Use ${chalk.cyan(registries.taobao)} for faster installation?`,
      ),
    },
  ]);

  // 执行 npm/yarn config set registry https://registry.npm.taobao.org 命令，注册 taobao 源
  if (useTaobaoRegistry) {
    await execa(command, ['config', 'set', 'registry', registries.taobao]);
  }

  return save(useTaobaoRegistry);
};