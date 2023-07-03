const fs = require('fs-extra');
const inquirer = require('inquirer');
const chalk = require('chalk');

module.exports =async function hasExists(targetDir, options) {
  // 目录是否已经存在
  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir);
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
        console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
        await fs.remove(targetDir);
      }
    }
  }
};