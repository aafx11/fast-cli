const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

let _hasYarn;

exports.hasYarn = () => {
  if (typeof _hasYarn === 'boolean') {
    return _hasYarn;
  }
  try {
    execSync('yarn --version', { stdio: 'ignore' });
    return (_hasYarn = true);
  } catch (error) {
    return (_hasYarn = false);
  }
};

// 检查项目是否用的 Yarn
exports.hasProjectYarn = (cwd) => {
  const lockFile = path.join(cwd, 'yarn.lock');
  const result = fs.existsSync(lockFile);
  return checkYarn(result);
};

function checkYarn(result) {
  if (result && !exports.hasYarn()) throw new Error(`The project seems to require yarn but it's not installed.`);
  return result;
}