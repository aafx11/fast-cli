const fs = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');

module.exports =async function hasExists(targetAir, options) {
  // 目录是否已经存在
  if (fs.existsSync(targetAir)) {
    if (options.force) {
      await fs.remove(targetAir);
    } else {
      // 询问用户是否覆盖文件夹
      let { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: 'Target directory already exists Pick an action:',
          choices: [
            {
              name: 'Overwrite',
              value: 'overwrite',
            },
            {
              name: 'Cancel',
              value: false,
            },
          ],
        },
      ]);
  
      if (!action) {
        return;
      } if (action === 'overwrite') {
        console.log(`\r\n${chalk.red('Removing...')}`);
        await fs.remove(targetAir);
      }
    }
  }
};