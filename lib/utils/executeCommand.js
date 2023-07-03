const execa = require('execa');
const chalk = require('chalk');

module.exports = function executeCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = execa(command, args, {
      cwd, // 指定子进程的工作目录
      stdio: ['inherit', 'pipe', 'inherit'], // 将子进程的标准输入和错误输出继承自父进程,使控制台上可以显示子进程的标准输出
    });

    // 监听子进程的stdout输出事件
    child.stdout.on('data', buffer => {
      const str = buffer.toString();
      // 如果输出包含"warning"关键字，则跳过处理
      if (/warning/.test(str)) {
        return;
      }
      // 将输出写入到当前进程的stdout中
      process.stdout.write(buffer);
    });

    // 监听子进程的close事件
    child.on('close', code => {
      // 如果子进程执行失败（返回值不为0）
      if (code !== 0) {
        reject(new Error(`command failed: ${command}`));
        return;
      }
      resolve();
    });
  });
};