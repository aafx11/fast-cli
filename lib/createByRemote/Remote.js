const chalk = require('chalk');
const { getRepoList } = require('./http');

class Remote {
  async getRepo() {
    const res = await getRepoList();
    console.log(`${chalk.red('res')}`, res);
  }
}
module.exports = Remote;