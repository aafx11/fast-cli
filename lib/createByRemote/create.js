const path = require('path');
const chalk = require('chalk');
const hasExists = require('../utils/file/hasExists');
const Remote = require('./Remote.js');

async function create(name, options) {
  const cwd = process.cwd();
  const targetAir = path.join(cwd, name);
  await hasExists(targetAir, options);

  const remote = new Remote();
  const res = remote.getRepo();
  console.log(`${chalk.red('res2')}`, res);
}

module.exports = create;