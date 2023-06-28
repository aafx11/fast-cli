const fs = require('fs-extra');
const chalk = require('chalk');
const loadPresetFromDir = require('./loadPresetFromDir');

// 下载远程仓库的预设
module.exports = async function loadRemotePreset(repository, clone) {
  const os = require('os');
  const path = require('path');
  const download = require('download-git-repo');
  
  // fast-cli/remote-preset -> remote-preset 留下远程仓库的名称
  const presetName = repository
  .replace(/((?:.git)?#.*)/, '')
  .split('/')
  .slice(-1)[0]
  // for direct urls, it's hard to get the correct project name,
  // but we need to at least make sure no special characters remaining
  .replace(/[:#]/g, '');

  console.log(`${chalk.red('presetName')}`, presetName);

  // 创建一个临时目录 C:\Users\pc\AppData\Local\Temp\fast-cli-presets\remote-preset
  const tmpdir = path.join(os.tmpdir(), 'fast-cli-presets', presetName);
  console.log(`${chalk.red('tmpdir')}`, tmpdir);

  await new Promise((resolve, reject) => {
    // 参数:下载地址,下载到哪个目录,下载参数,下载完后的回调
    download(repository, tmpdir, {}, err => {
      if (err) return reject(err);
      resolve();
    });
  });

  return await loadPresetFromDir(tmpdir);
};