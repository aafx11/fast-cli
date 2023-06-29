#! /usr/bin/env node
// 自定义命令行指令
const program = require('commander');
// 命令行美化工具
const chalk = require('chalk');
// 生成logo
const figlet = require('figlet');

// 创建项目命令
program
// 定义命令和参数
.command('create <app-name>')
.description('create a new project')
// -f or --force 为强制创建，如果创建的目录存在则直接覆盖
.option('-f, --force', 'overwrite target directory if it exist')
.option('-p, --preset <presetName>', 'Skip prompts and use remote preset')
.action((name, options) => {
  require('../lib/create.js')(name, options);
});

// 打开UI界面
program
// 定义命令和参数
.command('ui')
.description('start and open the fast-cli ui')
.option('-H, --host <host>', 'Host used for the UI server (default: localhost)')
.option('-p, --port <port>', 'Port used for the UI server (by default search for available port)')
.action((options) => {
  require('../lib/cli-ui/ui')(options);
});

program
.version(`v${require('../package.json').version}`)
.usage('<command> [option]');

program
// 监听 --help执行
.on('--help', () => {
  // 使用 figlet 绘制 logo
  console.log('\r\n' + figlet.textSync('f a s t', {
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 80,
    whitespaceBreak: true,
  }));

  // 说明信息
  console.log(`\r\nRun ${chalk.cyan(`fast <command> --help`)} for detailed usage of given command\r\n`);
});

program.parse(process.argv);